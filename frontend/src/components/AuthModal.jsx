import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLogin, resetToken }) {
  const [viewState, setViewState] = useState('login'); // 'login', 'register', 'forgot_password', 'reset_password'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (resetToken) {
      setViewState('reset_password');
    }
  }, [resetToken]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state on close
      setTimeout(() => {
        if (!resetToken) setViewState('login');
        setError(null);
        setSuccessMsg(null);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      }, 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (viewState === 'login' || viewState === 'register') {
        if (viewState === 'register' && formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const endpoint = viewState === 'login' ? '/api/users/login' : '/api/users/register';
        const url = `${(import.meta.env.VITE_API_URL || '').replace(/\\/$/, '')}${endpoint}`;
        
        const bodyData = viewState === 'login' 
          ? { email: formData.email, password: formData.password } 
          : { name: formData.name, email: formData.email, password: formData.password };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Authentication failed');
        
        // Save token & Login (Both register and login return token)
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        onLogin?.();
        
      } else if (viewState === 'forgot_password') {
        const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/users/forgotpassword`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to send email');
        setSuccessMsg("Password reset link has been sent to your email.");
      } else if (viewState === 'reset_password') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/users/resetpassword/${resetToken}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to reset password');
        setSuccessMsg("Password reset successfully. You can now login.");
        setTimeout(() => setViewState('login'), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch(viewState) {
      case 'login': return "Welcome back";
      case 'register': return "Create an account";
      case 'forgot_password': return "Reset Password";
      case 'reset_password': return "Create New Password";
      default: return "";
    }
  };

  const getSubtitle = () => {
    switch(viewState) {
      case 'login': return "Enter your details to access your account.";
      case 'register': return "Join the revolution of transparent supplements.";
      case 'forgot_password': return "Enter your email and we'll send you a link to reset your password.";
      case 'reset_password': return "Enter your new password below.";
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-[95vw] max-w-4xl rounded-[2rem] border border-border shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden relative flex flex-col md:flex-row min-h-[500px]"
            >
              <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-20 bg-background/50 backdrop-blur rounded-full p-2">
                <X size={24} />
              </button>

              {/* Image Side */}
              <div className="hidden md:block w-1/2 relative bg-muted">
                <img src="/images/auth_side.png" alt="Lumina Premium Ingredients" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="text-3xl font-bold tracking-tighter uppercase text-white mb-2">Lumina.</div>
                  <p className="text-white/80 text-sm">Experience the purest form of performance nutrition.</p>
                </div>
              </div>

              {/* Form Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card relative overflow-hidden">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">
                    {getTitle()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {getSubtitle()}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle size={18} />
                    <p className="font-medium">{error}</p>
                  </div>
                )}
                
                {successMsg && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-500 text-sm">
                    <CheckCircle2 size={18} />
                    <p className="font-medium">{successMsg}</p>
                  </div>
                )}

                <form className="space-y-4 relative" onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={viewState}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {viewState === 'register' && (
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent transition-colors shadow-sm"
                          />
                        </div>
                      )}
                      
                      {(viewState === 'login' || viewState === 'register' || viewState === 'forgot_password') && (
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input 
                            type="email" 
                            placeholder="Email address" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent transition-colors shadow-sm"
                          />
                        </div>
                      )}
                      
                      {(viewState === 'login' || viewState === 'register' || viewState === 'reset_password') && (
                        <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input 
                            type="password" 
                            placeholder={viewState === 'reset_password' ? "New Password" : "Password"}
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent transition-colors shadow-sm"
                          />
                        </div>
                      )}

                      {(viewState === 'register' || viewState === 'reset_password') && (
                        <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            required
                            minLength={6}
                            value={formData.confirmPassword}
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent transition-colors shadow-sm"
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {viewState === 'login' && (
                    <div className="flex justify-between items-center px-1">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-border text-accent focus:ring-accent" />
                        Remember me
                      </label>
                      <button 
                        type="button" 
                        onClick={() => { setViewState('forgot_password'); setError(null); setSuccessMsg(null); }} 
                        className="text-sm text-accent hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading} 
                    className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-all mt-6 flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(132,159,137,0.2)]"
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {viewState === 'login' ? "Sign In" : 
                     viewState === 'register' ? "Create Account" : 
                     viewState === 'forgot_password' ? "Send Reset Link" : 
                     "Reset Password"}
                  </motion.button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                  {viewState === 'login' && (
                    <>
                      Don't have an account?{" "}
                      <button 
                        onClick={() => { setViewState('register'); setError(null); setSuccessMsg(null); }}
                        className="text-foreground font-bold hover:text-accent transition-colors ml-1"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                  {viewState === 'register' && (
                    <>
                      Already have an account?{" "}
                      <button 
                        onClick={() => { setViewState('login'); setError(null); setSuccessMsg(null); }}
                        className="text-foreground font-bold hover:text-accent transition-colors ml-1"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                  {viewState === 'forgot_password' && (
                    <>
                      Remember your password?{" "}
                      <button 
                        onClick={() => { setViewState('login'); setError(null); setSuccessMsg(null); }}
                        className="text-foreground font-bold hover:text-accent transition-colors ml-1"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
