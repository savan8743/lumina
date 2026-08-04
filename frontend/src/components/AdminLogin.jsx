import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2 } from 'lucide-react';

import { useToast } from '../context/ToastContext';

export function AdminLogin({ onLogin }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'admin' || data.role === 'superadmin') {
          localStorage.setItem('adminInfo', JSON.stringify(data));
          localStorage.setItem('token', data.token);
          onLogin(data);
          toast.success('Successfully logged in');
        } else {
          toast.error('Access denied. Admin privileges required.');
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
              placeholder="admin@protin.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
