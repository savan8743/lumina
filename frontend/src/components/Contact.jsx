import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';

export function Contact() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/cms/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactDetails = settings?.contactDetails || {
    email: "support@luminanaturals.com",
    phone: "+1 (800) 123-4567",
    address: "123 Wellness Ave, NY 10012"
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-card border-y border-border">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tighter mb-6"
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg mb-12"
          >
            Have questions about your order or our formulas? Our support team is here to help you 24/7.
          </motion.p>
          
          <div className="space-y-6">
            {[
              { icon: Mail, text: contactDetails.email, label: "Email Us" },
              { icon: Phone, text: contactDetails.phone, label: "Call Us" },
              { icon: MapPin, text: contactDetails.address, label: "Headquarters" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-accent">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
                    <div className="font-semibold">{item.text}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-background border border-border p-8 rounded-3xl"
        >
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors min-h-[120px]" placeholder="How can we help?" />
              </div>
              
              {status === 'error' && (
                <div className="text-danger text-sm font-medium">Failed to send message. Please try again.</div>
              )}
              
              <button disabled={status === 'loading'} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors mt-2 flex items-center justify-center gap-2">
                {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
