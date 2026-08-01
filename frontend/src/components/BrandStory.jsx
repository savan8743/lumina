import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function BrandStory() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden bg-muted/20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Parallax Image / Placeholder */}
        <div className="relative h-[600px] rounded-[3rem] overflow-hidden bg-background border border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          {/* Using framer motion for parallax effect inside the container */}
          <motion.div 
            style={{ y }} 
            className="absolute -inset-10"
          >
            <img src="/images/brand_story.png" alt="Athlete mixing Lumina Naturals protein" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Story Text */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-background border border-border text-foreground text-sm font-semibold rounded-full w-max"
          >
            Our Mission
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1]"
          >
            Redefining the <br />
            <span className="text-muted-foreground">Supplement Industry</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Frustrated by proprietary blends and artificial fillers, we set out to create the supplement we actually wanted to take. Lumina was born from a simple belief: you deserve to know exactly what's fueling your body.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Every batch is third-party tested, every ingredient is transparent, and every flavor is naturally crafted. We don't cut corners, because neither do you.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-8 mt-4 border-t border-border grid grid-cols-2 gap-8"
          >
            <div>
              <div className="text-4xl font-bold text-accent mb-2">0%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Artificial Fillers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Transparent</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
