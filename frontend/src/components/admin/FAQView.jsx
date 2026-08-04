import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, HelpCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function FAQView() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/faqs/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      showToast('Error fetching FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const question = prompt('Enter FAQ Question:');
    const answer = prompt('Enter FAQ Answer:');
    if (!question || !answer) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question, answer })
      });
      fetchFaqs();
      showToast('FAQ added successfully', 'success');
    } catch (err) {
      showToast('Error adding FAQ', 'error');
    }
  };

  const handleEdit = async (faq) => {
    const question = prompt('Edit Question:', faq.question);
    const answer = prompt('Edit Answer:', faq.answer);
    if (!question || !answer) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/faqs/${faq._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question, answer })
      });
      fetchFaqs();
      showToast('FAQ updated successfully', 'success');
    } catch (err) {
      showToast('Error updating FAQ', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFaqs();
      showToast('FAQ deleted', 'success');
    } catch (err) {
      showToast('Error deleting FAQ', 'error');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <button onClick={handleAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
          <Plus size={18} /> Add FAQ
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Question</th>
              <th className="p-4 font-semibold w-1/2">Answer</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq._id} className="border-b border-border last:border-0 hover:bg-primary/10 hover:text-primary transition-colors">
                <td className="p-4 font-medium">{faq.question}</td>
                <td className="p-4 text-muted-foreground truncate max-w-xs">{faq.answer}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(faq)} className="p-2 bg-primary/5 hover:bg-primary/15 hover:text-primary text-foreground hover:text-primary rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(faq._id)} className="p-2 bg-danger/5 hover:bg-danger/15 hover:text-danger text-foreground hover:text-danger rounded-lg">
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
  );
}
