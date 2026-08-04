import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProductDetailsModal } from './ProductDetailsModal';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = async (product) => {
    try {
      await addToCart(product._id || product.id, 1);
      showToast('Added to cart!', 'success');
    } catch (err) {
      showToast('Please login to add to cart', 'error');
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`)
      .then(res => res.json())
      .then(data => {
        // Assume API returns { products: [...] } based on standard patterns or just [...]
        const items = data.products || data || [];
        setProducts(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const displayedProducts = showAll ? products : products.slice(0, 3);

  return (
    <section id="shop" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Featured Products
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-xl"
            >
              Discover our top-rated supplements designed to help you crush your goals.
            </motion.p>
          </div>
          {products.length > 3 && (
            <motion.button 
              onClick={() => setShowAll(!showAll)}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-accent hover:text-accent-foreground font-semibold flex items-center gap-2 group"
            >
              {showAll ? 'Show Less' : 'View All Products'}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product, index) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
                index={index} 
                onClick={() => setSelectedProduct(product)}
                onClickAdd={handleQuickAdd}
              />
            ))}
            {products.length === 0 && (
              <p className="text-muted-foreground md:col-span-3 text-center">No products found.</p>
            )}
          </div>
        )}
      </div>
      
      <ProductDetailsModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </section>
  );
}

function ProductCard({ product, index, onClick, onClickAdd }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.01 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group bg-card border border-border rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-shadow relative cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative h-80 bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center overflow-hidden">
        {/* Animated Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] animate-pulse-glow" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {(product.tags || []).map(tag => (
            <span key={tag} className="px-3 py-1 bg-background/80 backdrop-blur-md text-xs font-semibold rounded-full border border-border">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Placeholder for 3D/Premium Image */}
        <motion.div 
          className="w-48 h-64 relative z-0"
          style={{ perspective: 1000 }}
        >
          <motion.div
            animate={{ rotateY: isHovered ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full h-full relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 bg-background border border-border rounded-2xl shadow-xl overflow-hidden" 
              style={{ backfaceVisibility: "hidden" }}
            >
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img src="/images/featured_product.png" alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 bg-[#11100C] text-white border border-accent/20 rounded-2xl shadow-xl overflow-hidden p-4 flex flex-col justify-center items-center text-center gap-3" 
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
               <h4 className="font-bold text-base leading-tight text-accent">{product.name}</h4>
               <p className="text-[10px] text-slate-300 line-clamp-4">{product.description}</p>
               <div className="text-sm font-bold text-white mt-1">Rs. {product.price}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Add Button overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClickAdd(product);
                }} 
                className="bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold shadow-2xl flex items-center gap-2 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <ShoppingBag size={18} className="relative z-10" />
                <span className="relative z-10">Quick Add</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center gap-1 text-accent mb-2">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-semibold">{product.rating || 0}</span>
          <span className="text-sm text-muted-foreground ml-1">({product.reviews || 0})</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-accent">${product.discountPrice}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price}</span>
            )}
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onClick(); }} 
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-colors"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
