import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, ShieldAlert } from 'lucide-react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { cn } from './lib/utils';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BrandStory } from './components/BrandStory';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { LuminaMath } from './components/LuminaMath';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLogin } from './components/AdminLogin';

const AdminRoute = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(() => {
    const saved = localStorage.getItem('adminInfo');
    return saved ? JSON.parse(saved) : null;
  });

  if (!adminInfo) {
    return <AdminLogin onLogin={setAdminInfo} />;
  }
  
  return children;
};

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password/:token" element={<Home />} />
          <Route path="/admin/*" element={
            <ThemeProvider>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ThemeProvider>
          } />
        </Routes>
      </CartProvider>
    </ToastProvider>
  );
}

function Home() {
  const { token } = useParams();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(!!token);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const { fetchCart } = useCart();

  React.useEffect(() => {
    fetchCart();
    if (token) {
      setIsAuthOpen(true);
    }
  }, [fetchCart, token]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleLogin = () => {
    setIsAuthOpen(false);
    fetchCart();
    setIsCustomerDashboardOpen(true);
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden relative animate-gradient-pan" 
         style={{ background: 'linear-gradient(120deg, var(--background) 0%, var(--muted) 50%, var(--background) 100%)' }}>
      {/* Soft Ambient Wash */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-accent/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
      </div>
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={handleCheckout} 
      />
      
      <CheckoutDrawer 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      {isAuthOpen && (
        <AuthModal 
          isOpen={isAuthOpen}
          onClose={() => {
             setIsAuthOpen(false);
             if(token) {
                 window.history.replaceState({}, document.title, "/");
             }
          }}
          onLogin={handleLogin}
          resetToken={token}
        />
      )}

      <CustomerDashboard 
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
      />

      <main>
        <HeroSection />
        <WhyChooseUs />
        <FeaturedProducts />
        <BrandStory />
        <CustomerReviews />
        <FAQ />
        <Contact />
      </main>
      
      <footer className="bg-[#11100C] text-slate-300 py-20 px-6 mt-24 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold tracking-tighter uppercase text-white mb-6">
              Lumina.
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm mb-8">
              Redefining the standard for premium nutrition. Pure ingredients, full transparency, and zero compromises for the modern athlete.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-[#11100C] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-[#11100C] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase">Shop</h4>
            <ul className="space-y-4">
              <li><a href="#shop" className="hover:text-accent transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Whey Isolate</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Plant Protein</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase">Support</h4>
            <ul className="space-y-4">
              <li><a href="#faq" className="hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Track Order</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase">Company</h4>
            <ul className="space-y-4">
              <li><a href="#about" className="hover:text-accent transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Lab Results</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li>
                <Link to="/admin" className="hover:text-accent transition-colors flex items-center gap-2">
                  <ShieldAlert size={14} /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Lumina Naturals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Navbar({ onOpenCart, onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.qty, 0) || 0;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
      "fixed top-0 w-full z-40 transition-all duration-500 px-6 lg:px-12 py-4",
      isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tighter uppercase cursor-pointer text-primary">
          Lumina.
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#shop" className="hover:text-accent transition-colors">Shop</a>
          <a href="#about" className="hover:text-accent transition-colors">About</a>
          <a href="#science" className="hover:text-accent transition-colors">The Science</a>
          <a href="#reviews" className="hover:text-accent transition-colors">Reviews</a>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6">
          <button className="hover:text-accent transition-colors"><Search size={20} /></button>
          <button onClick={onOpenAuth} className="hover:text-accent transition-colors"><User size={20} /></button>
          <button onClick={onOpenCart} className="hover:text-accent transition-colors relative">
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">{cartItemCount}</span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-6 shadow-2xl md:hidden"
          >
            <a href="#shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-accent transition-colors">Shop</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-accent transition-colors">About</a>
            <a href="#science" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-accent transition-colors">The Science</a>
            <div className="flex gap-6 mt-4 pt-4 border-t border-border">
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }} className="flex items-center gap-2 hover:text-accent"><User size={20} /> Account</button>
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenCart(); }} className="flex items-center gap-2 hover:text-accent"><ShoppingBag size={20} /> Cart ({cartItemCount})</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      
      {/* Continuous Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        {/* Subtle sharp floating leaves (squares rotated as diamonds) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute w-8 h-8 bg-accent/30 rounded-tl-full rounded-br-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-[0.2em] rounded-full w-max">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            The Premium Standard
          </div>
          <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95]">
            PURE PERFORMANCE.<br/>
            <span className="text-muted-foreground/50">ZERO COMPROMISE.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
            Elevate your potential with our ultra-filtered whey isolate. Formulated with zero artificial fillers for elite athletes.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold shadow-[0_10px_30px_rgba(132,159,137,0.3)] transition-shadow relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(132,159,137,0.5)] text-lg"
            >
              <span className="relative z-10 tracking-wider">SHOP NOW</span>
              <div className="absolute inset-0 bg-white/20 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "var(--muted)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-border px-10 py-5 rounded-full font-bold transition-colors tracking-wider text-lg"
            >
              DISCOVER MORE
            </motion.button>
          </div>
          
          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border/50">
            <div className="flex -space-x-4">
              {['avatar_1', 'avatar_2', 'avatar_3'].map((avatar, i) => (
                <img key={i} src={`/images/${avatar}.png`} alt={`Happy customer ${i+1}`} className="w-12 h-12 rounded-full border-[3px] border-background object-cover shadow-sm" />
              ))}
              <div className="w-12 h-12 rounded-full bg-muted border-[3px] border-background flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm">+9k</div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-accent text-base mb-1">★★★★★</div>
              <span className="text-sm font-medium text-muted-foreground">Trusted by 10,000+ Athletes</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 25, delay: 0.4 }}
          className="relative h-[600px] lg:h-[700px] flex items-center justify-center"
        >
          {/* Pulsing Backlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 blur-[100px] animate-pulse-glow" />
          
          {/* Majestic Hero Product Image */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[500px] h-full"
          >
            <img src="/images/hero_majestic.png" alt="Lumina Majestic Isolate" className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center text-muted-foreground">
        <p>&copy; 2026 Protin. Premium D2C Experience.</p>
      </div>
    </footer>
  );
}
