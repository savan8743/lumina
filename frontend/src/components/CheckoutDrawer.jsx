import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper to dynamically load the Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function CheckoutDrawer({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // Hardcoded for demo, normally pulled from Cart context
  const total = 109.97;
  const cartItems = [
    { product: "64c8d9f1a2b3c4d5e6f7g8h9", name: "Whey Isolate", image: "img.jpg", price: 49.99, qty: 2 }
  ];

  const [shippingAddress, setShippingAddress] = useState({
    street: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA'
  });

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // Get token from localStorage (assuming the user is logged in)
      const token = localStorage.getItem('token') || '';

      // 1. Create Razorpay Order on Backend
      const orderRes = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/payment/razorpay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: total })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Protin Supplement Store",
        description: "Premium Whey Checkout",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Verify Payment
            const verifyRes = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/payment/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: total,
                currency: "INR"
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              // 4. Create Final Order
              const finalOrderRes = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  orderItems: cartItems,
                  shippingAddress,
                  paymentMethod: 'Razorpay',
                  itemsPrice: total,
                  taxPrice: 0,
                  shippingPrice: 0,
                  totalPrice: total,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  paymentReference: verifyData.paymentRecordId,
                  isPaid: true,
                  paidAt: new Date().toISOString()
                })
              });

              if (finalOrderRes.ok) {
                setOrderId(response.razorpay_order_id);
                setStep(3);
              } else {
                setError("Payment succeeded but order creation failed. Please contact support.");
              }
            } else {
              setError("Payment signature verification failed!");
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response){
        setError(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      
      paymentObject.open();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Reset state when drawer closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setStep(1);
        setError(null);
        setLoading(false);
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-background/40 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-card border-l border-border shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold">Secure Checkout</h2>
              <button onClick={onClose} disabled={loading} className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
                {[1, 2, 3].map((num) => (
                  <div key={num} className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                    step >= num ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground border border-border"
                  )}>
                    {step > num ? <CheckCircle2 size={16} /> : num}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500">
                  <AlertCircle size={20} />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="First Name" />
                      <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="Last Name" />
                    </div>
                    <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="Address" defaultValue={shippingAddress.street} />
                    <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="City" defaultValue={shippingAddress.city} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="State" defaultValue={shippingAddress.state} />
                      <input className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="ZIP Code" defaultValue={shippingAddress.zipCode} />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl mt-8 hover:bg-primary/90 flex items-center justify-center gap-2">
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-accent rounded-xl bg-accent/5 cursor-pointer relative overflow-hidden">
                      <div className="font-semibold mb-1">Razorpay Secure Checkout</div>
                      <div className="text-sm text-muted-foreground">Pay using UPI, Cards, Netbanking, or Wallets</div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} disabled={loading} className="px-6 py-4 rounded-xl border border-border hover:bg-muted font-semibold disabled:opacity-50">Back</button>
                    <button 
                      onClick={handlePayment} 
                      disabled={loading}
                      className="flex-1 bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-75 transition-all"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : `Pay $${total}`}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Order Confirmed!</h3>
                  <p className="text-muted-foreground mb-4">Your order has been placed successfully.</p>
                  <p className="text-sm font-mono bg-muted p-2 rounded inline-block mb-8 border border-border">Order ID: {orderId}</p>
                  <br />
                  <button onClick={onClose} className="bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-xl hover:bg-primary/90">
                    Back to Store
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
