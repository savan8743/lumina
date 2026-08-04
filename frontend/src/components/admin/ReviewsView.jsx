import React, { useState, useEffect } from 'react';
import { Edit, Trash, Loader2, Star, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      showToast('Error fetching Reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (review) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/${review._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isApproved: !review.isApproved })
      });
      fetchReviews();
      showToast('Review updated', 'success');
    } catch (err) {
      showToast('Error updating review', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchReviews();
      showToast('Review deleted', 'success');
    } catch (err) {
      showToast('Error deleting review', 'error');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold w-1/3">Content</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b border-border last:border-0 hover:bg-primary/10 hover:text-primary transition-colors">
                <td className="p-4">
                  <div className="font-medium">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </td>
                <td className="p-4">
                  <div className="flex text-accent">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </td>
                <td className="p-4 text-muted-foreground truncate max-w-xs">{review.content}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${review.isApproved ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleApproval(review)} className="p-2 bg-primary/5 hover:bg-primary/15 hover:text-primary text-foreground hover:text-primary rounded-lg" title={review.isApproved ? "Disapprove" : "Approve"}>
                      {review.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button onClick={() => handleDelete(review._id)} className="p-2 bg-danger/5 hover:bg-danger/15 hover:text-danger text-foreground hover:text-danger rounded-lg">
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
