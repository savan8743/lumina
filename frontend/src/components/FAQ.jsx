import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/faqs`)
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching FAQs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tighter mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={faq._id || index} faq={faq} index={index} />
            ))}
            {faqs.length === 0 && (
              <p className="text-center text-muted-foreground">No FAQs available at the moment.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-border rounded-2xl bg-card overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-lg">{faq.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="text-accent" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
