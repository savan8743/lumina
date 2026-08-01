import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ContactMessagesView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/contact/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      showToast('Error fetching messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      fetchMessages();
      showToast(`Marked as ${status}`, 'success');
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMessages();
      showToast('Message deleted', 'success');
    } catch (err) {
      showToast('Error deleting message', 'error');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold w-1/3">Message</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="border-b border-border last:border-0 hover:bg-primary/10 hover:text-primary transition-colors">
                <td className="p-4 font-medium">{msg.firstName} {msg.lastName}</td>
                <td className="p-4 text-muted-foreground">{msg.email}</td>
                <td className="p-4 text-muted-foreground truncate max-w-xs">{msg.message}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${msg.status === 'Unread' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-success/10 text-success border border-success/20'}`}>
                    {msg.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {msg.status === 'Unread' && (
                      <button onClick={() => updateStatus(msg._id, 'Read')} className="p-2 bg-muted hover:bg-success/20 text-foreground hover:text-success rounded-lg" title="Mark as Read">
                        <Check size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(msg._id)} className="p-2 bg-danger/5 hover:bg-danger/15 hover:text-danger text-foreground hover:text-danger rounded-lg">
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
