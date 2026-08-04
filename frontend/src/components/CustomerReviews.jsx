import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Loader2 } from 'lucide-react';

export function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      {/* Continuous Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tighter mb-4"
          >
            Don't Just Take Our Word For It
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-xl"
          >
            <span className="font-bold">4.9/5</span>
            <div className="flex text-accent">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <span className="text-muted-foreground text-sm ml-2">Based on 10,000+ reviews</span>
          </motion.div>
        </div>
      </div>

      <div className="w-full relative z-10">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="relative w-full overflow-hidden py-10">
            {/* Edge fade gradients */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <motion.div 
              className="flex w-max gap-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={`${review._id || index}-${index}`}
                  className="w-[350px] md:w-[450px] shrink-0 bg-card/80 backdrop-blur-md border border-border p-8 rounded-3xl relative shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col cursor-pointer"
                >
                  <div className="flex text-accent mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed mb-8 flex-1">"{review.content}"</p>
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                    <div className="w-12 h-12 bg-muted rounded-full overflow-hidden flex items-center justify-center border-2 border-background shadow-sm shrink-0">
                      <img src={`/images/avatar_${(index % 3) + 1}.png`} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold">{review.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {review.role} 
                        <CheckCircle2 size={14} className="text-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {reviews.length === 0 && (
              <p className="text-center text-muted-foreground">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
