import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, ArrowUpRight, Users, Eye, Power, Plus, X, Shield, Mail, Phone, MapPin, Calendar, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export function CustomersView() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const isSuperAdmin = adminInfo.role === 'superadmin';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      toast.warning('No data to export');
      return;
    }
    
    const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date', 'Phone'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(u => [
        `"${u.name || ''}"`,
        `"${u.email || ''}"`,
        `"${u.role || 'user'}"`,
        `"${u.status || 'active'}"`,
        `"${new Date(u.createdAt).toLocaleDateString()}"`,
        `"${u.phone || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export downloaded successfully');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setIsCreatingAdmin(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/users/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAdmin)
      });
      
      if (res.ok) {
        toast.success('Admin created successfully');
        setIsAdminModalOpen(false);
        setNewAdmin({ name: '', email: '', password: '' });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to create admin');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleToggleStatus = async (userId, currentRole) => {
    if (currentRole === 'superadmin') {
      toast.error('Cannot change status of a Super Admin');
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/users/${userId}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'admin': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getStatusBadgeStyle = (status) => {
    return status === 'blocked' 
      ? 'bg-danger/10 text-danger border border-danger/20' 
      : 'bg-success/10 text-success border border-success/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers & Admins</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage registered users, roles, and statuses.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="bg-card border border-border text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap">
            <ArrowUpRight size={16} /> Export CSV
          </button>
          {isSuperAdmin && (
            <button onClick={() => setIsAdminModalOpen(true)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap">
              <Plus size={16} /> Add Admin
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Role:</span>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-4 px-6">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-muted-foreground">No users found matching your criteria.</td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-primary/10 hover:text-primary transition-colors transition-colors group">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold border border-border uppercase shrink-0">
                      {user.name?.substring(0, 2) || <Users size={16} />}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-foreground">{user.email}</div>
                    {user.phone && <div className="text-xs text-muted-foreground mt-0.5">{user.phone}</div>}
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getRoleBadgeStyle(user.role))}>
                      {user.role || 'User'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusBadgeStyle(user.status))}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {isSuperAdmin && user.role !== 'superadmin' && (
                        <button 
                          onClick={() => handleToggleStatus(user._id, user.role)}
                          className={cn("p-2 rounded-lg transition-colors", 
                            user.status === 'blocked' 
                              ? "text-success hover:bg-success/10 hover:text-success" 
                              : "text-muted-foreground hover:text-danger hover:bg-danger/10 hover:text-danger"
                          )} 
                          title={user.status === 'blocked' ? "Activate User" : "Deactivate User"}
                        >
                          <Power size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/10">
                <h3 className="text-lg font-bold">User Details</h3>
                <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                {/* Header Profile */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold uppercase border-2 border-primary/20 shrink-0">
                    {selectedUser.name?.substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                    <div className="flex gap-2 mt-2">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getRoleBadgeStyle(selectedUser.role))}>
                        {selectedUser.role || 'User'}
                      </span>
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusBadgeStyle(selectedUser.status))}>
                        {selectedUser.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Mail size={14} /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">Email</div>
                          <div className="text-sm font-medium">{selectedUser.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Phone size={14} /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">Phone</div>
                          <div className="text-sm font-medium">{selectedUser.phone || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Calendar size={14} /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">Joined Date</div>
                          <div className="text-sm font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Activity size={14} /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">Last Updated</div>
                          <div className="text-sm font-medium">{new Date(selectedUser.updatedAt).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Saved Addresses</h4>
                  {!selectedUser.addresses || selectedUser.addresses.length === 0 ? (
                    <div className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl border border-border border-dashed text-center">No addresses saved.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.addresses.map((address, idx) => (
                        <div key={idx} className="bg-muted/10 border border-border p-4 rounded-xl relative">
                          {address.isDefault && (
                            <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                          )}
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium">{address.street}</p>
                              <p className="text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
                              <p className="text-muted-foreground">{address.country}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-primary" />
                  <h3 className="text-lg font-bold">Create Admin</h3>
                </div>
                <button onClick={() => setIsAdminModalOpen(false)} className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleCreateAdmin}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                    <input 
                      type="text" required
                      value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" 
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                    <input 
                      type="email" required
                      value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" 
                      placeholder="john@protin.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Secure Password</label>
                    <input 
                      type="password" required minLength={6}
                      value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-muted/10">
                  <button type="button" onClick={() => setIsAdminModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/10 hover:text-primary border border-border transition-colors">Cancel</button>
                  <button type="submit" disabled={isCreatingAdmin} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50 shadow-sm">
                    {isCreatingAdmin ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                    Create Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
