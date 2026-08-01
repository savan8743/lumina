import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Users, Tag, Settings, CreditCard, Search, Bell, Menu, X, ArrowUpRight, DollarSign, Activity, Image as ImageIcon, Edit, Trash, Plus, Upload, Loader2, Sun, Moon, LogOut, List, HelpCircle, Star, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { OrdersView } from './admin/OrdersView';
import { CustomersView } from './admin/CustomersView';
import { PaymentsView } from './admin/PaymentsView';
import { CouponsView } from './admin/CouponsView';
import { SettingsView } from './admin/SettingsView';
import { CategoriesView } from './admin/CategoriesView';
import { FAQView } from './admin/FAQView';
import { ReviewsView } from './admin/ReviewsView';
import { ContactMessagesView } from './admin/ContactMessagesView';
import { useToast } from '../context/ToastContext';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const userInitials = adminInfo.name ? adminInfo.name.substring(0, 2).toUpperCase() : 'AD';

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'categories', icon: List, label: 'Categories' },
    { id: 'orders', icon: CreditCard, label: 'Orders' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'payments', icon: DollarSign, label: 'Payments' },
    { id: 'coupons', icon: Tag, label: 'Coupons' },
    { id: 'faq', icon: HelpCircle, label: 'FAQs' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'contact', icon: Mail, label: 'Contact' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-screen bg-muted/30 flex overflow-hidden font-sans text-foreground">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        <motion.div 
          initial={false}
          animate={{ width: isSidebarOpen ? 260 : 80 }}
          className="h-full bg-sidebar border-r border-sidebar-border flex flex-col shadow-sm relative z-20 shrink-0"
        >
          <div className="h-16 px-6 border-b border-sidebar-border flex items-center justify-between shrink-0">
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="font-bold text-xl tracking-tight text-primary flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm">L</div>
                Lumina
              </motion.span>
            )}
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -mr-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
              <Menu size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  activeTab === item.id ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-sidebar-foreground hover:bg-primary/10 hover:text-primary hover:text-foreground",
                  !isSidebarOpen && "justify-center"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon size={18} className={cn("shrink-0", activeTab === item.id ? "text-primary-foreground" : "text-sidebar-foreground group-hover:text-foreground")} />
                {isSidebarOpen && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="truncate">
                    {item.label}
                  </motion.span>
                )}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-sidebar-border shrink-0">
            <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-danger hover:bg-danger/10 transition-colors group">
              <LogOut size={18} className="shrink-0 group-hover:text-danger" />
              {isSidebarOpen && <span className="truncate">Exit to Store</span>}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span className="capitalize">{activeTab}</span>
              <span>/</span>
              <span className="text-foreground">Overview</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 bg-muted/50 border border-border rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
              />
            </div>
            
            <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-card" />
            </button>
            
            <div className="relative group ml-2">
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-background shadow-sm overflow-hidden flex items-center justify-center text-primary-foreground text-xs font-bold ring-2 ring-border">
                  {userInitials}
                </div>
              </div>
              
              {/* Dropdown Menu (Hover) */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                <div className="p-4 border-b border-border bg-muted/10 rounded-t-2xl">
                  <p className="text-sm font-bold truncate text-foreground">{adminInfo.name || 'Admin User'}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{adminInfo.email || 'admin@protin.com'}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => setActiveTab('settings')} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-colors flex items-center gap-2">
                    <Settings size={14} /> Account Settings
                  </button>
                  <Link to="/" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('adminInfo'); }} className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors flex items-center gap-2 mt-1">
                    <LogOut size={14} /> Log Out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'products' && <ProductsView />}
              {activeTab === 'categories' && <CategoriesView />}
              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'customers' && <CustomersView />}
              {activeTab === 'payments' && <PaymentsView />}
              {activeTab === 'coupons' && <CouponsView />}
              {activeTab === 'faq' && <FAQView />}
              {activeTab === 'reviews' && <ReviewsView />}
              {activeTab === 'contact' && <ContactMessagesView />}
              {activeTab === 'settings' && <SettingsView />}
              {activeTab !== 'dashboard' && activeTab !== 'products' && activeTab !== 'categories' && activeTab !== 'orders' && activeTab !== 'customers' && activeTab !== 'payments' && activeTab !== 'coupons' && activeTab !== 'faq' && activeTab !== 'reviews' && activeTab !== 'contact' && activeTab !== 'settings' && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-card rounded-[2rem] border border-border border-dashed">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                    <Settings size={32} className="opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h3>
                  <p>The {navItems.find(i => i.id === activeTab)?.label} module is under construction.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function DashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          toast.error(result.message || 'Failed to fetch analytics');
        }
      } catch (err) {
        toast.error('Network error while fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const { stats = {}, recentOrders = [] } = data || {};
  const formattedRevenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue || 0);

  const statCards = [
    { label: 'Total Revenue', value: formattedRevenue, trend: '+14%', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Orders', value: stats.totalOrders || 0, trend: '+5%', icon: Package, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Total Customers', value: stats.totalCustomers || 0, trend: '+12%', icon: Users, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Products', value: stats.totalProducts || 0, trend: '+1.2%', icon: Activity, color: 'text-accent', bg: 'bg-accent/10' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 transition-colors shadow-sm flex items-center gap-2">
          <ArrowUpRight size={16} /> Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={64} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                {stat.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</div>
            <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Revenue Chart</h3>
            <select className="bg-muted border border-border rounded-lg text-sm px-3 py-1.5 outline-none focus:border-primary">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <Activity size={32} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Chart visualization pending integration</span>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <button className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {recentOrders.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center mt-10">No recent orders.</div>
            ) : recentOrders.map((order, i) => (
              <div key={order._id || i} className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground border border-border group-hover:border-primary/30 transition-colors uppercase shrink-0">
                    {order.user?.name ? order.user.name.substring(0, 2) : <Users size={16} />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm group-hover:text-primary transition-colors">{order.user?.name || 'Guest User'}</div>
                    <div className="text-xs text-muted-foreground font-mono">#ORD-{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-foreground">${order.totalPrice?.toFixed(2)}</div>
                  <div className={cn("text-[10px] uppercase font-bold tracking-wider mt-1", 
                    order.status === 'Delivered' ? 'text-success' : 'text-warning'
                  )}>
                    {order.status || 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsView() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', price: 0, salePrice: 0, sku: '',
    stock: 0, category: '', status: 'active', images: [],
    bulletPoints: [''], highlights: [], variants: []
  });
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/products?pageSize=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/categories`);
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchCategories();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '', 
        slug: product.slug || '', 
        description: product.description || '',
        price: product.price || 0, 
        salePrice: product.salePrice || 0, 
        sku: product.sku || '',
        stock: product.stock || 0, 
        category: product.category?._id || categories[0]?._id || '', 
        status: product.status || 'active', 
        images: product.images || [],
        bulletPoints: product.bulletPoints?.length ? product.bulletPoints : [''],
        highlights: product.highlights || [],
        variants: product.variants || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', slug: '', description: '', price: 0, salePrice: 0, sku: '',
        stock: 0, category: categories[0]?._id || '', status: 'active', images: [],
        bulletPoints: [''], highlights: [], variants: []
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    setUploading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.imageUrl] }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Image upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload image. Network error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (!payload.slug) delete payload.slug;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to save product');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
        setProductToDelete(null);
        toast.success('Product deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your inventory, prices, and variants.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search products..." className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <button className="text-sm font-medium border border-border bg-background px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
            <Settings size={14} /> Filter
          </button>
        </div>
        
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border sticky top-0 backdrop-blur z-10">
              <tr>
                <th className="p-4 px-6 w-10">
                  <input type="checkbox" className="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                </th>
                <th className="py-4 px-2">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                    <div className="text-muted-foreground mt-4 text-sm font-medium">Loading products...</div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center bg-muted/10">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
                      <Package size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">No products found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">Get started by adding your first product to the inventory.</p>
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product._id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 px-6">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary transition-opacity" />
                  </td>
                  <td className="py-3 px-2 flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-border text-[8px] font-bold overflow-hidden shrink-0 shadow-sm relative">
                      {product.images?.[0] ? <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-muted-foreground/50" />}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">{product.name}</div>
                      <div className="text-[11px] text-muted-foreground uppercase font-mono mt-0.5 tracking-wider">{product.sku}</div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground font-medium text-sm">
                    {product.category?.name ? (
                      <span className="bg-muted px-2.5 py-1 rounded-md text-xs border border-border">{product.category.name}</span>
                    ) : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">${product.salePrice || product.price}</div>
                    {product.salePrice && product.salePrice < product.price && (
                      <div className="text-[11px] text-muted-foreground line-through mt-0.5">${product.price}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full", product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-danger")} />
                      <span className={cn("font-medium", product.stock < 10 ? "text-warning" : "text-foreground")}>{product.stock}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex w-max items-center gap-1", 
                      product.status === 'active' ? "bg-success/10 text-success border border-success/20" : 
                      product.status === 'draft' ? "bg-warning/10 text-warning border border-warning/20" : 
                      "bg-danger/10 text-danger border border-danger/20"
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(product)} className="text-muted-foreground hover:text-primary transition-colors p-1.5 hover:bg-primary/10 rounded-md" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setProductToDelete(product)} className="text-muted-foreground hover:text-danger transition-colors p-1.5 hover:bg-danger/10 rounded-md" title="Delete">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing <span className="font-medium text-foreground">{products.length}</span> results</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-border rounded-lg bg-background hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 border border-border rounded-lg bg-background hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="bg-card w-full max-w-5xl rounded-3xl border border-border shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fill out the information below to {editingProduct ? 'update the' : 'create a new'} product.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                  {/* General Section */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">General Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-sm font-semibold mb-1 block text-foreground">Product Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Whey Isolate" className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block text-foreground">SKU Code</label>
                        <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. WHEY-ISO-01" className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none font-mono text-sm transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-semibold mb-1 block text-foreground">Description</label>
                        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your product clearly..." className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none min-h-[80px] transition-all shadow-sm focus:ring-4 focus:ring-primary/10 resize-y" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Pricing & Inventory */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-1 block text-foreground">Regular Price</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block text-foreground">Sale Price (Optional)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <input type="number" step="0.01" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block text-foreground">Stock Quantity</label>
                        <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Bullet Points */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Bullet Points</h3>
                    <div className="space-y-3">
                      {formData.bulletPoints.map((point, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input type="text" value={point} onChange={e => {
                            const newPoints = [...formData.bulletPoints];
                            newPoints[index] = e.target.value;
                            setFormData({...formData, bulletPoints: newPoints});
                          }} placeholder="e.g. 46g protein per 100g Atta" className="flex-1 bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                          <button type="button" onClick={() => {
                            setFormData({...formData, bulletPoints: formData.bulletPoints.filter((_, i) => i !== index)});
                          }} className="p-3 text-danger bg-danger/10 hover:bg-danger/20 rounded-xl transition-colors"><Trash size={18} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, bulletPoints: [...formData.bulletPoints, '']})} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={16}/> Add Bullet Point</button>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Highlights */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Highlights</h3>
                    <div className="space-y-3">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-3 items-start bg-muted/20 p-4 rounded-xl border border-border">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                            <div>
                               <label className="text-xs font-semibold mb-1 block text-foreground">Icon (e.g. Flame)</label>
                               <input type="text" value={highlight.icon} onChange={e => {
                                 const newHighlights = [...formData.highlights];
                                 newHighlights[index].icon = e.target.value;
                                 setFormData({...formData, highlights: newHighlights});
                               }} placeholder="Icon Name/URL" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                            <div>
                               <label className="text-xs font-semibold mb-1 block text-foreground">Title</label>
                               <input type="text" value={highlight.title} onChange={e => {
                                 const newHighlights = [...formData.highlights];
                                 newHighlights[index].title = e.target.value;
                                 setFormData({...formData, highlights: newHighlights});
                               }} placeholder="e.g. 46g Protein" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                            <div>
                               <label className="text-xs font-semibold mb-1 block text-foreground">Subtitle</label>
                               <input type="text" value={highlight.subtitle} onChange={e => {
                                 const newHighlights = [...formData.highlights];
                                 newHighlights[index].subtitle = e.target.value;
                                 setFormData({...formData, highlights: newHighlights});
                               }} placeholder="e.g. in 3 Rotis" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                          </div>
                          <button type="button" onClick={() => {
                            setFormData({...formData, highlights: formData.highlights.filter((_, i) => i !== index)});
                          }} className="p-2 mt-5 text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-colors"><Trash size={16} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, highlights: [...formData.highlights, {icon: '', title: '', subtitle: ''}]})} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={16}/> Add Highlight</button>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Variants */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Variants</h3>
                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex gap-3 items-start bg-muted/20 p-4 rounded-xl border border-border flex-wrap">
                            <div className="flex-1 min-w-[120px]">
                               <label className="text-xs font-semibold mb-1 block text-foreground">Weight/Size</label>
                               <input type="text" value={variant.weight} onChange={e => {
                                 const newVariants = [...formData.variants];
                                 newVariants[index].weight = e.target.value;
                                 setFormData({...formData, variants: newVariants});
                               }} placeholder="e.g. 2 kg" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                            <div className="flex-1 min-w-[120px]">
                               <label className="text-xs font-semibold mb-1 block text-foreground">Sale Price</label>
                               <input type="number" step="0.01" value={variant.price} onChange={e => {
                                 const newVariants = [...formData.variants];
                                 newVariants[index].price = e.target.value;
                                 setFormData({...formData, variants: newVariants});
                               }} placeholder="Price" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                            <div className="flex-1 min-w-[120px]">
                               <label className="text-xs font-semibold mb-1 block text-foreground">Orig. Price</label>
                               <input type="number" step="0.01" value={variant.originalPrice} onChange={e => {
                                 const newVariants = [...formData.variants];
                                 newVariants[index].originalPrice = e.target.value;
                                 setFormData({...formData, variants: newVariants});
                               }} placeholder="Orig Price" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                            <div className="flex-1 min-w-[120px]">
                               <label className="text-xs font-semibold mb-1 block text-foreground">Label</label>
                               <input type="text" value={variant.label} onChange={e => {
                                 const newVariants = [...formData.variants];
                                 newVariants[index].label = e.target.value;
                                 setFormData({...formData, variants: newVariants});
                               }} placeholder="e.g. BEST SELLER" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm" />
                            </div>
                          <button type="button" onClick={() => {
                            setFormData({...formData, variants: formData.variants.filter((_, i) => i !== index)});
                          }} className="p-2 mt-5 text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-colors"><Trash size={16} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, variants: [...formData.variants, {weight: '', price: 0, originalPrice: 0, label: '', sku: '', stock: 0}]})} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={16}/> Add Variant</button>
                    </div>
                  </div>

                  <hr className="border-border" />
                  
                  {/* Categorization */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Categorization</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-1 block text-foreground">Category</label>
                        <div className="relative">
                          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10 appearance-none">
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">▼</div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block text-foreground">Status</label>
                        <div className="relative">
                          <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10 appearance-none">
                            <option value="active">Active (Visible to customers)</option>
                            <option value="inactive">Inactive (Hidden)</option>
                            <option value="draft">Draft (Work in progress)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">▼</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Media */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Product Images</h3>
                    <div className="flex flex-wrap gap-4 items-center">
                      <AnimatePresence>
                        {formData.images.map((img, idx) => (
                          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="w-28 h-28 bg-muted rounded-2xl border border-border overflow-hidden relative group shadow-sm">
                            <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData(p => ({...p, images: p.images.filter((_, i) => i !== idx)}))} className="absolute inset-0 bg-danger/80 text-danger-foreground flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                              <Trash size={20} className="mb-1" />
                              <span className="text-[10px] font-bold uppercase">Remove</span>
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <label className="w-28 h-28 border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary cursor-pointer transition-all shadow-sm hover:border-primary">
                        {uploading ? <Loader2 size={24} className="animate-spin mb-1" /> : <Upload size={24} className="mb-1" />}
                        <span className="text-xs font-semibold">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Upload high-quality PNG or JPG images. 1080x1080 recommended.</p>
                  </div>
                </form>
              </div>
              
              <div className="px-8 py-5 border-t border-border flex justify-end gap-3 bg-muted/20">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/10 hover:text-primary border border-border transition-colors text-foreground">Cancel</button>
                <button type="submit" form="productForm" className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 transition-colors shadow-md shadow-primary/20 flex items-center gap-2">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-card w-full max-w-sm rounded-3xl border border-border shadow-2xl overflow-hidden relative flex flex-col">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash size={32} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Delete Product?</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">"{productToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end gap-3">
                <button onClick={() => setProductToDelete(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border">Cancel</button>
                <button onClick={() => handleDelete(productToDelete._id)} className="bg-danger text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-danger/90 transition-colors shadow-sm">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
