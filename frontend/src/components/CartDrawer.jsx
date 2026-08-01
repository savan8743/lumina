import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

export function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  
  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-background/40 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-card border-l border-border shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} /> Your Cart ({cartItemCount})
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product} className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground -rotate-90">PROTIN</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h4>
                      <div className="text-muted-foreground text-sm mb-2">${item.price}</div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.product, item.qty - 1)} className="w-6 h-6 flex items-center justify-center bg-muted rounded hover:bg-background border border-border transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.product, item.qty + 1)} className="w-6 h-6 flex items-center justify-center bg-muted rounded hover:bg-background border border-border transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product)} className="text-muted-foreground hover:text-accent p-2 self-start transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-border bg-card/50">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Shipping and taxes calculated at checkout.</p>
              <button 
                onClick={onCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
