import React, { useState, useEffect } from 'react';
import { Loader2, Save, User as UserIcon, Shield, Key } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export function SettingsView() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    siteName: '', contactEmail: '', currency: 'USD', shippingFee: 0, taxRate: 0
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '', confirmPassword: ''
  });

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cms/settings`);
      const data = await res.json();
      if (data) {
        setFormData({
          siteName: data.websiteName || '',
          contactEmail: data.contactDetails?.email || '',
          currency: data.storeConfig?.currency || 'USD',
          shippingFee: data.storeConfig?.shippingCharge || 0,
          taxRate: data.storeConfig?.taxRate || 0
        });
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const token = localStorage.getItem('token') || '';
      
      const payload = {
        websiteName: formData.siteName,
        contactDetails: {
          email: formData.contactEmail
        },
        storeConfig: {
          currency: formData.currency,
          shippingCharge: Number(formData.shippingFee),
          taxRate: Number(formData.taxRate)
        }
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cms/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success('Store Settings saved successfully!');
      } else {
        toast.error('Failed to save settings.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setChangingPassword(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: passwordData.newPassword })
      });
      
      if (res.ok) {
        toast.success('Password changed successfully!');
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to change password.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage global store configuration and your personal account.</p>
      </div>

      {/* Profile & Password Section */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Profile Info */}
        <div className="p-8 md:w-1/3 bg-muted/10 border-b md:border-b-0 md:border-r border-border flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold uppercase border-4 border-primary/20 mb-4 shadow-sm">
            {adminInfo.name?.substring(0, 2) || <UserIcon size={32} />}
          </div>
          <h2 className="text-xl font-bold text-foreground">{adminInfo.name || 'Admin User'}</h2>
          <p className="text-sm text-muted-foreground mt-1">{adminInfo.email}</p>
          <div className="mt-4 flex items-center justify-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-full shadow-sm">
            <Shield size={14} className={adminInfo.role === 'superadmin' ? 'text-purple-500' : 'text-primary'} />
            <span className={cn("text-xs font-bold uppercase tracking-wider", 
              adminInfo.role === 'superadmin' ? 'text-purple-500' : 'text-primary'
            )}>
              {adminInfo.role || 'Admin'}
            </span>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="p-8 md:w-2/3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Key size={16} /> Security Settings
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">New Password</label>
              <input 
                type="password" 
                value={passwordData.newPassword} 
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" 
                placeholder="••••••••" 
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Confirm New Password</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" 
                placeholder="••••••••" 
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={changingPassword || !passwordData.newPassword || !passwordData.confirmPassword} 
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Store Settings Form */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden p-8">
        <form onSubmit={handleSettingsSubmit} className="space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">General Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">Store Name</label>
                <input required type="text" value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">Contact Email</label>
                <input required type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Checkout & Finance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">Currency</label>
                <select required value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">Default Shipping Fee</label>
                <input required type="number" step="0.01" value={formData.shippingFee} onChange={e => setFormData({...formData, shippingFee: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">Tax Rate (%)</label>
                <input required type="number" step="0.01" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={savingSettings} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-colors shadow-md shadow-primary/20 flex items-center gap-2">
              {savingSettings ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
