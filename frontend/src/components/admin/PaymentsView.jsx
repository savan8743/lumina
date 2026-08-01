import React, { useState, useEffect } from 'react';
import { Search, Loader2, ArrowUpRight, Download, Eye, X, CreditCard, User, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export function PaymentsView() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/payment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const searchMatch = 
      (payment.razorpayPaymentId && payment.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (payment.order && payment.order.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (payment.user?.name && payment.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const statusMatch = statusFilter === 'All' || 
                        (statusFilter === 'Success' && (payment.status === 'Completed' || payment.status === 'Success' || payment.status === 'paid')) ||
                        (statusFilter === 'Failed' && payment.status !== 'Completed' && payment.status !== 'Success' && payment.status !== 'paid');
    
    return searchMatch && statusMatch;
  });

  const exportToCSV = () => {
    if (filteredPayments.length === 0) {
      toast.error('No payments to export');
      return;
    }
    
    const headers = ['Transaction ID', 'Order ID', 'Customer Name', 'Amount', 'Method', 'Status', 'Date'];
    const csvData = filteredPayments.map(payment => [
      payment.razorpayPaymentId || payment._id,
      payment.order || 'N/A',
      payment.user?.name || 'Guest',
      payment.amount?.toFixed(2) || '0.00',
      payment.method || 'Razorpay',
      (payment.status === 'Completed' || payment.status === 'Success' || payment.status === 'paid') ? 'Success' : 'Failed',
      new Date(payment.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Payments exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">View Razorpay transactions and settlements.</p>
        </div>
        <button onClick={exportToCSV} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by Transaction ID or Name..." 
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
              <option value="Success">Success</option>
              <option value="Failed">Failed/Pending</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-4 px-6">Transaction ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-muted-foreground">No payments found.</td>
                </tr>
              ) : filteredPayments.map(payment => (
                <tr key={payment._id} className="hover:bg-primary/10 hover:text-primary transition-colors transition-colors">
                  <td className="p-4 px-6 font-mono text-xs text-muted-foreground">{payment.razorpayPaymentId || payment._id}</td>
                  <td className="p-4 font-medium text-foreground">{payment.user?.name || 'Guest'}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">#{payment.order?.substring(payment.order.length - 8).toUpperCase() || 'N/A'}</td>
                  <td className="p-4 font-bold text-foreground">${payment.amount?.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {payment.method || 'Razorpay'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", 
                      (payment.status === 'Completed' || payment.status === 'Success' || payment.status === 'paid') ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"
                    )}>
                      {(payment.status === 'Completed' || payment.status === 'Success' || payment.status === 'paid') ? 'Success' : (payment.status || 'Pending')}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => setSelectedPayment(payment)}
                      className="p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:text-primary rounded-lg transition-colors inline-block"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedPayment(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard size={18} className="text-primary"/> Payment Details</h2>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:text-foreground rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                <div className="text-center p-6 bg-muted/10 rounded-2xl border border-border">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Amount Settled</p>
                  <h3 className="text-4xl font-bold text-foreground">${selectedPayment.amount?.toFixed(2)}</h3>
                  <div className="mt-3 inline-block">
                    <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider block", 
                      (selectedPayment.status === 'Completed' || selectedPayment.status === 'Success' || selectedPayment.status === 'paid') ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {(selectedPayment.status === 'Completed' || selectedPayment.status === 'Success' || selectedPayment.status === 'paid') ? 'Successful Transaction' : (selectedPayment.status || 'Pending')}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors transition-colors">
                    <div className="mt-0.5 text-muted-foreground"><User size={18} /></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Customer</p>
                      <p className="text-sm text-muted-foreground">{selectedPayment.user?.name || 'Guest User'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors transition-colors">
                    <div className="mt-0.5 text-muted-foreground"><FileText size={18} /></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Reference IDs</p>
                      <p className="text-sm text-muted-foreground font-mono mt-1">TXN: {selectedPayment.razorpayPaymentId || selectedPayment._id}</p>
                      <p className="text-sm text-muted-foreground font-mono mt-0.5">ORD: {selectedPayment.order}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors transition-colors">
                    <div className="mt-0.5 text-muted-foreground"><CreditCard size={18} /></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Gateway Information</p>
                      <p className="text-sm text-muted-foreground mt-1">Method: {selectedPayment.method || 'Razorpay'}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Date: {new Date(selectedPayment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
                <button onClick={() => setSelectedPayment(null)} className="px-6 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors text-foreground">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
