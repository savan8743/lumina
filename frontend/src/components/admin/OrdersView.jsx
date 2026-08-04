import React, { useState, useEffect } from 'react';
import { Search, Settings, Loader2, ArrowUpRight, Edit, Eye, X, MapPin, Package, CreditCard, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export function OrdersView() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchMatch = 
      (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user && order.user.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user && order.user.email && order.user.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const statusMatch = statusFilter === 'All' || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Items Count', 'Total Price', 'Payment Status', 'Delivery Status'];
    const csvData = filteredOrders.map(order => [
      order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.user?.name || 'Guest',
      order.user?.email || 'N/A',
      order.orderItems?.length || 0,
      order.totalPrice?.toFixed(2) || '0.00',
      order.isPaid ? 'Paid' : 'Unpaid',
      order.status || 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track customer orders.</p>
        </div>
        <button onClick={exportToCSV} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Email..." 
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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-4 px-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-muted-foreground">No orders found.</td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-primary/10 hover:text-primary transition-colors transition-colors">
                  <td className="p-4 px-6 font-mono text-xs text-muted-foreground">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">{order.user?.name || 'Guest'}</div>
                    <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-foreground">${order.totalPrice?.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", 
                      order.isPaid ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"
                    )}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4">
                     <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", 
                      order.status === 'Delivered' ? "bg-success/10 text-success border border-success/20" : 
                      order.status === 'Processing' ? "bg-primary/10 text-primary border border-primary/20" :
                      order.status === 'Shipped' ? "bg-accent/10 text-accent border border-accent/20" :
                      order.status === 'Cancelled' ? "bg-danger/10 text-danger border border-danger/20" :
                      "bg-warning/10 text-warning border border-warning/20"
                    )}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:text-primary rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {updatingId === order._id ? (
                      <Loader2 size={16} className="animate-spin ml-2 text-primary" />
                    ) : (
                      <select 
                        value={order.status || 'Pending'}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="bg-background border border-border rounded-md text-xs py-1 px-2 focus:border-primary outline-none cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                        title="Update Status"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-full"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30 sticky top-0 z-10">
                <div>
                  <h2 className="text-lg font-bold">Order Details</h2>
                  <p className="text-sm text-muted-foreground font-mono">#{selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:text-foreground rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Details */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-muted/10 border border-border rounded-2xl p-5">
                      <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                        <Package size={18} className="text-primary" /> Order Items
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-background border border-border rounded-xl overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty} × ${item.price?.toFixed(2)}</p>
                            </div>
                            <div className="font-bold text-sm">
                              ${(item.qty * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline / Status */}
                    <div className="bg-muted/10 border border-border rounded-2xl p-5">
                      <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                        Delivery Status
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Current Status: <span className="text-primary">{selectedOrder.status}</span></p>
                          <p className="text-xs text-muted-foreground mt-1">Update status using the dropdown in the main table.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Customer & Summary */}
                  <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-muted/10 border border-border rounded-2xl p-5">
                      <h3 className="font-bold mb-4 border-b border-border pb-3 text-sm uppercase tracking-wider text-muted-foreground">Customer</h3>
                      <div className="text-sm space-y-2">
                        <p className="font-semibold">{selectedOrder.user?.name || 'Guest'}</p>
                        <p className="text-muted-foreground">{selectedOrder.user?.email}</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-muted/10 border border-border rounded-2xl p-5">
                      <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3 text-sm uppercase tracking-wider text-muted-foreground">
                        <MapPin size={16} /> Shipping Address
                      </h3>
                      {selectedOrder.shippingAddress ? (
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p className="text-foreground font-medium">{selectedOrder.shippingAddress.address}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No shipping address provided.</p>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-muted/10 border border-border rounded-2xl p-5">
                      <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3 text-sm uppercase tracking-wider text-muted-foreground">
                        <CreditCard size={16} /> Payment Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Items:</span>
                          <span>${selectedOrder.itemsPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping:</span>
                          <span>${selectedOrder.shippingPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax:</span>
                          <span>${selectedOrder.taxPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-primary">${selectedOrder.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="pt-2">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider block text-center", 
                            selectedOrder.isPaid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                          )}>
                            {selectedOrder.isPaid ? `Paid on ${new Date(selectedOrder.paidAt).toLocaleDateString()}` : 'Not Paid'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
