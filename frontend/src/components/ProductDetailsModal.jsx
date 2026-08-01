import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export function ProductDetailsModal({ isOpen, onClose, product }) {
  const [selectedWeight, setSelectedWeight] = useState('2 lbs');
  const [selectedFlavor, setSelectedFlavor] = useState('Chocolate Fudge');
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

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

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-6xl max-h-[90vh] rounded-[2rem] border border-border shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-background/50 backdrop-blur rounded-full text-foreground hover:bg-background transition-colors z-20">
                <X size={24} />
              </button>

              {/* Product Image Gallery */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-background to-muted p-8 flex items-center justify-center relative min-h-[300px] md:min-h-full">
                <div className="w-64 h-80 md:w-80 md:h-[400px] bg-background border border-border rounded-3xl shadow-2xl flex items-center justify-center relative">
                  <span className="text-muted-foreground/30 font-bold -rotate-90 whitespace-nowrap text-4xl tracking-widest">LUMINA</span>
                  <div className="absolute bottom-8 text-center w-full">
                    <div className="text-accent font-bold mb-1 uppercase tracking-wider text-sm">{selectedFlavor}</div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                  <span className="text-foreground ml-2 text-sm font-medium">{product.rating} ({product.reviews} reviews)</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                  {product.discountPrice ? (
                    <>
                      <span className="text-4xl font-bold text-accent">${product.discountPrice}</span>
                      <span className="text-2xl text-muted-foreground line-through">${product.price}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">${product.price}</span>
                  )}
                </div>

                {/* Variants */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Select Weight</h4>
                    <div className="flex gap-3">
                      {['2 lbs', '5 lbs'].map(weight => (
                        <button 
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={cn(
                            "px-6 py-3 rounded-xl border font-semibold transition-colors flex items-center gap-2",
                            selectedWeight === weight 
                              ? "border-accent bg-accent/5 text-accent" 
                              : "border-border bg-background hover:border-accent/50 text-foreground"
                          )}
                        >
                          {selectedWeight === weight && <Check size={16} />}
                          {weight}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Select Flavor</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['Chocolate Fudge', 'Vanilla Bean', 'Strawberry Blast', 'Unflavored'].map(flavor => (
                        <button 
                          key={flavor}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-sm font-semibold transition-colors text-left flex justify-between items-center",
                            selectedFlavor === flavor 
                              ? "border-accent bg-accent/5 text-accent" 
                              : "border-border bg-background hover:border-accent/50 text-foreground"
                          )}
                        >
                          {flavor}
                          {selectedFlavor === flavor && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-16 h-14 bg-background border border-border rounded-xl flex items-center justify-center font-semibold text-lg">
                    1
                  </div>
                  <button 
                    onClick={async () => {
                      setIsAdding(true);
                      try {
                        await addToCart(product._id || product.id, 1);
                        showToast('Added to cart!', 'success');
                        onClose();
                      } catch (err) {
                        showToast('Please login to add to cart', 'error');
                      } finally {
                        setIsAdding(false);
                      }
                    }}
                    disabled={isAdding}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isAdding ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}
                    Add to Cart - ${product.discountPrice || product.price}
                  </button>
                </div>

                {/* Nutrition Accordion Placeholder */}
                <div className="mt-12 space-y-4">
                  <div className="p-4 border border-border rounded-xl bg-background font-semibold cursor-pointer hover:bg-muted/50 transition-colors">
                    Nutrition Facts & Ingredients
                  </div>
                  <div className="p-4 border border-border rounded-xl bg-background font-semibold cursor-pointer hover:bg-muted/50 transition-colors">
                    Usage Instructions
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
