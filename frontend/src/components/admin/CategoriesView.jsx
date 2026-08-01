import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash, Loader2, X, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export function CategoriesView() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    sortOrder: 0
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/categories`);
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'active',
        sortOrder: category.sortOrder || 0
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        status: 'active',
        sortOrder: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to save category');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
        setCategoryToDelete(null);
        toast.success('Category deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete category');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product categories and collections.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search categories..." className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border sticky top-0 backdrop-blur z-10">
              <tr>
                <th className="py-4 px-6">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                    <div className="text-muted-foreground mt-4 text-sm font-medium">Loading categories...</div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center bg-muted/10">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
                      <Tag size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">No categories found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">Get started by adding your first product category.</p>
                  </td>
                </tr>
              ) : categories.map(category => (
                <tr key={category._id} className="hover:bg-primary/10 hover:text-primary transition-colors transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground">{category.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">/{category.slug}</div>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-[300px] truncate">{category.description || '-'}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider",
                      category.status === 'active' ? "bg-success/10 text-success" : 
                      category.status === 'inactive' ? "bg-muted text-muted-foreground" : "bg-warning/10 text-warning"
                    )}>
                      {category.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(category)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setCategoryToDelete(category)} className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 hover:text-danger rounded-lg transition-colors" title="Delete">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fill out the information below.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-foreground">Category Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Proteins" className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-foreground">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe this category..." className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none min-h-[80px] transition-all shadow-sm focus:ring-4 focus:ring-primary/10 resize-y" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1 block text-foreground">Status</label>
                      <div className="relative">
                        <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10 appearance-none">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">▼</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block text-foreground">Sort Order</label>
                      <input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})} className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary/10" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end gap-3 sticky bottom-0 z-10">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors">Cancel</button>
                <button type="submit" form="categoryForm" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors shadow-sm">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-card w-full max-w-sm rounded-3xl border border-border shadow-2xl overflow-hidden relative flex flex-col">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash size={32} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Delete Category?</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">"{categoryToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end gap-3">
                <button onClick={() => setCategoryToDelete(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors">Cancel</button>
                <button onClick={() => handleDelete(categoryToDelete._id)} className="bg-danger text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-danger/10 hover:text-danger transition-colors shadow-sm">
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
