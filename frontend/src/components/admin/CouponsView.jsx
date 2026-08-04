import React, { useState, useEffect } from 'react';
import { Search, Loader2, Plus, Edit, Trash, X, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export function CouponsView() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    code: '', discountType: 'percentage', discountAmount: 0, minPurchase: 0, maxDiscount: 0, expirationDate: '', isActive: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        discountType: coupon.discountType || 'percentage',
        discountAmount: coupon.discountAmount || 0,
        minPurchase: coupon.minPurchase || 0,
        maxDiscount: coupon.maxDiscount || 0,
        expirationDate: coupon.expirationDate ? new Date(coupon.expirationDate).toISOString().split('T')[0] : '',
        isActive: coupon.isActive ?? true
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '', discountType: 'percentage', discountAmount: 0, minPurchase: 0, maxDiscount: 0, expirationDate: '', isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const payload = { ...formData, code: formData.code.toUpperCase() };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created');
        fetchCoupons();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to save coupon');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const searchMatch = coupon.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === 'All' || 
                        (statusFilter === 'Active' && coupon.isActive) ||
                        (statusFilter === 'Inactive' && !coupon.isActive);
    return searchMatch && statusMatch;
  });

  const exportToCSV = () => {
    if (filteredCoupons.length === 0) {
      toast.error('No coupons to export');
      return;
    }
    
    const headers = ['Code', 'Discount Type', 'Discount Amount', 'Min Purchase', 'Expiration Date', 'Status'];
    const csvData = filteredCoupons.map(coupon => [
      coupon.code,
      coupon.discountType,
      coupon.discountAmount,
      coupon.minPurchase || 0,
      coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never',
      coupon.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `coupons_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Coupons exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage discount codes.</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={exportToCSV} className="bg-background text-foreground border border-border px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap">
            <Download size={16} /> Export
          </button>
          <button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap">
            <Plus size={16} /> Create Coupon
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border rounded-lg text-sm px-3 py-2 outline-none focus:border-primary"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-4 px-6">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Purchase</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-muted-foreground">No coupons found.</td>
                </tr>
              ) : filteredCoupons.map(coupon => (
                <tr key={coupon._id} className="hover:bg-primary/10 hover:text-primary transition-colors transition-colors group">
                  <td className="p-4 px-6 font-mono font-bold text-foreground text-base tracking-wider">{coupon.code}</td>
                  <td className="p-4 text-muted-foreground font-medium">
                    {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `$${coupon.discountAmount} OFF`}
                  </td>
                  <td className="p-4 text-muted-foreground">${coupon.minPurchase}</td>
                  <td className="p-4 text-muted-foreground">
                    {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", 
                      coupon.isActive ? "bg-success/10 text-success border border-success/20" : "bg-muted text-muted-foreground border border-border"
                    )}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(coupon)} className="text-muted-foreground hover:text-primary transition-colors p-1.5 hover:bg-primary/10 hover:text-primary rounded-md">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon._id)} className="text-muted-foreground hover:text-danger transition-colors p-1.5 hover:bg-danger/10 hover:text-danger rounded-md">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                <form id="couponForm" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-foreground">Coupon Code</label>
                    <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10 uppercase font-mono" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-foreground">Discount Type</label>
                      <select required value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-foreground">Discount Amount</label>
                      <input required type="number" step="0.01" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-foreground">Minimum Purchase ($)</label>
                      <input type="number" step="0.01" value={formData.minPurchase} onChange={e => setFormData({...formData, minPurchase: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                    </div>
                    {formData.discountType === 'percentage' && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-foreground">Max Discount ($)</label>
                        <input type="number" step="0.01" value={formData.maxDiscount} onChange={e => setFormData({...formData, maxDiscount: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-foreground">Expiration Date (Optional)</label>
                      <input type="date" value={formData.expirationDate} onChange={e => setFormData({...formData, expirationDate: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                    </div>
                    <div className="flex items-center gap-3 mt-8">
                      <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                      <label htmlFor="isActive" className="text-sm font-semibold text-foreground cursor-pointer">Coupon is Active</label>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="px-8 py-5 border-t border-border flex justify-end gap-3 bg-muted/20">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/10 hover:text-primary border border-border transition-colors text-foreground">Cancel</button>
                <button type="submit" form="couponForm" className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-colors shadow-md shadow-primary/20">
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
