import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewFor, setReviewFor] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [cancelError, setCancelError] = useState('');

  function load() {
    setLoading(true);
    apiClient.get('/bookings/mine').then((res) => setBookings(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function cancelBooking(id) {
    setCancelError('');
    try {
      await apiClient.patch(`/bookings/${id}/status`, { status: 'cancelled' });
      load();
    } catch (err) {
      setCancelError(err.response?.data?.error || 'Could not cancel this booking. Please try again.');
    }
  }

  function openReview(bookingId) {
    setReviewFor(bookingId);
    setRating(5);
    setComment('');
    setReviewError('');
  }

  async function submitReview(bookingId) {
    setReviewError('');
    setSubmittingReview(true);
    try {
      await apiClient.post('/reviews', { bookingId, rating, comment });
      setReviewFor(null);
      setComment('');
      setRating(5);
      load();
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Could not submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) return <div className="p-10 text-center text-muted">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My bookings</h1>

      {cancelError && (
        <div className="bg-dangerlight text-danger text-sm rounded-md px-3 py-2 mb-4">{cancelError}</div>
      )}

      {bookings.length === 0 ? (
        <p className="text-muted">You haven't booked any services yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-border rounded-card shadow-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{b.helper_name}</h3>
                  <p className="text-sm text-muted">{b.plan_name} · {b.cycle}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <p className="text-sm text-inksoft">
                {new Date(b.scheduled_date).toLocaleDateString()} {b.scheduled_time ? `at ${b.scheduled_time}` : ''}
              </p>
              <p className="text-sm text-muted">{b.address}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="mono font-semibold">₹{b.total_price}</span>
                <div className="flex gap-2">
                  {['requested', 'accepted'].includes(b.status) && (
                    <button onClick={() => cancelBooking(b.id)} className="text-sm text-danger border border-danger/30 rounded-md px-3 py-1.5">
                      Cancel
                    </button>
                  )}
                  {b.status === 'completed' && !b.review_rating && reviewFor !== b.id && (
                    <button onClick={() => openReview(b.id)} className="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5">
                      Leave review
                    </button>
                  )}
                </div>
              </div>

              {b.review_rating && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs text-muted mb-1">Your review</p>
                  <div className="text-warning text-sm mb-1">
                    {'★'.repeat(b.review_rating)}{'☆'.repeat(5 - b.review_rating)}
                  </div>
                  {b.review_comment && <p className="text-sm text-inksoft">{b.review_comment}</p>}
                </div>
              )}

              {reviewFor === b.id && (
                <div className="mt-3 border-t border-border pt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setRating(n)} className={n <= rating ? 'text-warning' : 'text-border'}>★</button>
                    ))}
                  </div>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2}
                    placeholder="How was the service?" className="w-full border border-border rounded-md px-3 py-2 text-sm" />
                  {reviewError && <p className="text-danger text-sm">{reviewError}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => submitReview(b.id)} disabled={submittingReview}
                      className="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5 disabled:opacity-50">
                      {submittingReview ? 'Submitting…' : 'Submit review'}
                    </button>
                    <button onClick={() => setReviewFor(null)} disabled={submittingReview}
                      className="text-sm border border-border rounded-md px-3 py-1.5 disabled:opacity-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}