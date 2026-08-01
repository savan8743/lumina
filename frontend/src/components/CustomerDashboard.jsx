import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, MapPin, LogOut, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export function CustomerDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-16 md:top-24 bg-card border-t border-border z-50 shadow-2xl rounded-t-[2rem] overflow-hidden flex flex-col md:flex-row"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-muted rounded-full hover:bg-background transition-colors z-20">
              <X size={20} />
            </button>

            {/* Sidebar */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border p-8 bg-background flex flex-col">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="font-bold text-lg">John Doe</h3>
                  <p className="text-muted-foreground text-sm">john@example.com</p>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { id: 'orders', icon: Package, label: 'My Orders' },
                  { id: 'profile', icon: User, label: 'Profile Settings' },
                  { id: 'address', icon: MapPin, label: 'Saved Addresses' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                      activeTab === item.id 
                        ? "bg-accent/10 text-accent" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-colors mt-auto">
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-card">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Order History</h2>
                    <div className="space-y-4">
                      {/* Order Item */}
                      <div className="border border-border bg-background rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 border-b border-border pb-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Order #PRO-4921</div>
                            <div className="font-semibold mb-2">Placed on Oct 24, 2026</div>
                            <div className="flex items-center gap-2 text-xs font-mono bg-muted px-2 py-1 rounded inline-flex text-muted-foreground">
                              Txn: pay_M83021K9jN2P
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                              <div className="font-bold text-accent">$109.97 <span className="text-xs text-green-500 font-normal ml-1">Paid via Razorpay</span></div>
                            </div>
                            <button className="px-4 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="relative pt-8 pb-4 px-4 overflow-x-auto">
                          <div className="flex items-center justify-between min-w-[600px] relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[75%] h-0.5 bg-accent -z-10" />
                            
                            {[
                              { label: "Order Placed", active: true },
                              { label: "Processing", active: true },
                              { label: "Shipped", active: true },
                              { label: "Out for Delivery", active: true },
                              { label: "Delivered", active: false }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-2 relative bg-background px-2">
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                  step.active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background"
                                )}>
                                  {step.active && <CheckCircle2 size={14} />}
                                </div>
                                <span className={cn(
                                  "text-xs font-medium whitespace-nowrap",
                                  step.active ? "text-foreground" : "text-muted-foreground"
                                )}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center gap-4 bg-muted p-4 rounded-xl">
                          <div className="w-16 h-16 bg-background rounded-lg border border-border flex items-center justify-center">
                            <span className="text-[8px] text-muted-foreground -rotate-90">PROTIN</span>
                          </div>
                          <div>
                            <div className="font-semibold">Whey Isolate - Chocolate Fudge (x2)</div>
                            <div className="text-sm text-muted-foreground">Pre-Workout - Blue Raspberry (x1)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-2xl"
                  >
                    <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <input type="text" defaultValue="John" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <input type="text" defaultValue="Doe" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input type="email" defaultValue="john@example.com" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" />
                      </div>
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <input type="password" placeholder="Current Password" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" />
                          <input type="password" placeholder="New Password" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors" />
                        </div>
                      </div>
                      <button className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors">
                        Save Changes
                      </button>
                    </form>
                  </motion.div>
                )}
                
                {activeTab === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Saved Addresses</h2>
                      <button className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-sm">
                        Add New Address
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-accent bg-accent/5 p-6 rounded-2xl relative">
                        <div className="absolute top-6 right-6 text-xs font-bold bg-accent text-accent-foreground px-2 py-1 rounded">DEFAULT</div>
                        <h4 className="font-bold mb-2">Home</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          John Doe<br/>
                          123 Fitness Ave, Apt 4B<br/>
                          New York, NY 10012<br/>
                          United States
                        </p>
                        <div className="flex gap-3">
                          <button className="text-sm font-semibold hover:text-accent">Edit</button>
                          <button className="text-sm font-semibold text-red-500 hover:text-red-400">Delete</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
