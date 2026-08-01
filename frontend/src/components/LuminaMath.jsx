import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function LuminaMath() {
  const [isPremium, setIsPremium] = useState(true);

  return (
    <section className="py-24 px-6 bg-card relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            The <span className="text-accent">Lumina</span> Standard
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See exactly why our ultra-filtered isolate outperforms industry standards. No hidden math, just pure results.
          </p>
        </div>

        <div className="bg-background border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Header Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-muted p-1 rounded-full inline-flex relative">
              <div 
                className={cn(
                  "absolute inset-y-1 w-1/2 bg-background shadow-md rounded-full transition-transform duration-500 ease-in-out",
                  isPremium ? "translate-x-full" : "translate-x-0"
                )}
              />
              <button 
                onClick={() => setIsPremium(false)}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-colors relative z-10",
                  !isPremium ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                STANDARD WHEY
              </button>
              <button 
                onClick={() => setIsPremium(true)}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-colors relative z-10",
                  isPremium ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                LUMINA ISOLATE
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBox 
              label="Protein / Scoop" 
              value={isPremium ? "28g" : "20g"} 
              isGood={isPremium} 
            />
            <StatBox 
              label="Carbs" 
              value={isPremium ? "0g" : "5g"} 
              isGood={isPremium} 
            />
            <StatBox 
              label="Sugar" 
              value={isPremium ? "0g" : "3g"} 
              isGood={isPremium} 
            />
            <StatBox 
              label="Fillers" 
              value={isPremium ? "None" : "Yes"} 
              isGood={isPremium} 
              isText
            />
          </div>

          {/* Breakdown List */}
          <div className="mt-12 pt-12 border-t border-border/50">
            <h3 className="text-xl font-bold mb-6 text-center uppercase tracking-widest text-muted-foreground">Every Scoop, Broken Down</h3>
            <div className="space-y-4 max-w-2xl mx-auto">
              <BreakdownRow label="Pure Whey Isolate" value={isPremium ? "95%" : "70%"} fill={isPremium ? 95 : 70} />
              <BreakdownRow label="Natural Flavoring" value={isPremium ? "5%" : "10%"} fill={isPremium ? 5 : 10} />
              <BreakdownRow label="Artificial Additives" value={isPremium ? "0%" : "20%"} fill={isPremium ? 0 : 20} isBad />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value, isGood, isText }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-2xl border border-border/50">
      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">{label}</div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "text-4xl md:text-5xl font-bold tracking-tighter flex items-center gap-2",
            isGood ? "text-accent" : "text-foreground"
          )}
        >
          {isText && isGood ? <Check className="text-accent" size={32} /> : null}
          {isText && !isGood ? <X className="text-danger" size={32} /> : null}
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BreakdownRow({ label, value, fill, isBad }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1/3 text-sm font-semibold">{label}</div>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full rounded-full", isBad ? "bg-danger" : "bg-primary")}
          initial={{ width: 0 }}
          animate={{ width: `${fill}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </div>
      <div className="w-12 text-right font-bold font-mono">{value}</div>
    </div>
  );
}
