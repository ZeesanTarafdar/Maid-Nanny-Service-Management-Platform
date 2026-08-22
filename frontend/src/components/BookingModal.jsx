import React, { useState } from 'react';
import apiClient from '../api/client';

export default function BookingModal({ helper, plan, onClose, onBooked }) {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [durationHours, setDurationHours] = useState(3);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isHourly = plan.cycle === 'hourly';
  const total = isHourly ? Number(plan.price) * Number(durationHours || 1) : Number(plan.price);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!scheduledDate || !address) {
      setError('Please fill in the date and address.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await apiClient.post('/bookings', {
        helperId: helper.id,
        servicePlanId: plan.plan_id,
        scheduledDate,
        scheduledTime,
        durationHours: isHourly ? durationHours : null,
        address,
        notes,
      });
      onBooked(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create booking.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-card shadow-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Book {helper.full_name}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink">✕</button>
        </div>
        <p className="text-sm text-muted mb-4">{plan.name} · {plan.cycle}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Start time</label>
            <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          {isHourly && (
            <div>
              <label className="block text-sm mb-1">Duration (hours)</label>
              <select value={durationHours} onChange={(e) => setDurationHours(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm">
                {[1, 2, 3, 4, 5, 6, 8].map((h) => <option key={h} value={h}>{h} hrs</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Service address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Camac Street, Kolkata"
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>

          <div className="flex justify-between text-sm pt-1">
            <span>Rate</span>
            <span className="mono">₹{plan.price}{isHourly ? `/hr × ${durationHours} hrs` : ''}</span>
          </div>
          <div className="flex justify-between font-semibold pt-1 border-t border-border">
            <span>Estimated total</span>
            <span className="mono">₹{total}</span>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium mt-2 disabled:opacity-50">
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
