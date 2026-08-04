import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subTotal: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  // Helper to fetch auth token
  const getToken = () => localStorage.getItem('token') || '';

  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const syncCartWithServer = async (newItems) => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: newItems })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const addToCart = (product, qty = 1) => {
    const existingItem = cart.items.find(item => item.product === product._id);
    let newItems;
    
    if (existingItem) {
      newItems = cart.items.map(item => 
        item.product === product._id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      newItems = [...cart.items, {
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.salePrice || product.price,
        qty: qty
      }];
    }
    
    // Optimistic update
    setCart(prev => ({ ...prev, items: newItems }));
    syncCartWithServer(newItems);
  };

  const removeFromCart = (productId) => {
    const newItems = cart.items.filter(item => item.product !== productId);
    // Optimistic update
    setCart(prev => ({ ...prev, items: newItems }));
    syncCartWithServer(newItems);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return removeFromCart(productId);
    
    const newItems = cart.items.map(item => 
      item.product === productId ? { ...item, qty: newQty } : item
    );
    // Optimistic update
    setCart(prev => ({ ...prev, items: newItems }));
    syncCartWithServer(newItems);
  };

  const clearCart = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCart({ items: [], subTotal: 0, totalPrice: 0 });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
