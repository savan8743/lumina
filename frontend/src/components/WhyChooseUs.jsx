import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Dumbbell, Zap, Beaker, Leaf, HeartPulse } from 'lucide-react';
import { cn } from '../lib/utils';

const features = [
  { icon: Dumbbell, title: "Muscle Growth", description: "Packed with 25g of pure isolate protein per serving for maximum gains." },
  { icon: Zap, title: "Fast Recovery", description: "Rapid absorption formula to kickstart your post-workout recovery." },
  { icon: ShieldCheck, title: "Lab Tested", description: "Third-party tested for purity, banned-substance free, and safe for athletes." },
  { icon: Beaker, title: "Premium Ingredients", description: "Sourced from grass-fed cows with zero artificial fillers or junk." },
  { icon: Leaf, title: "No Added Sugar", description: "Naturally sweetened with Stevia. Less than 1g of carbs." },
  { icon: HeartPulse, title: "High Quality Formula", description: "Enhanced with digestive enzymes for zero bloating and max absorption." },
];

export function WhyChooseUs() {
  return (
    <section id="science" className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse-glow" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tighter mb-4"
          >
            Why Choose <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">Lumina</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We engineered the perfect protein powder so you don't have to compromise on taste, performance, or purity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 rounded-3xl bg-card border border-border shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-accent/50 transition-shadow group relative overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-14 h-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-6 text-accent group-hover:scale-110 group-hover:text-primary transition-transform relative z-10">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
