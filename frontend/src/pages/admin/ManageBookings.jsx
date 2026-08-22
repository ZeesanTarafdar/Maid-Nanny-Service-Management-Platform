import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['', 'requested', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled'];

export default function ManageBookings() {
  const [status, setStatus] = useState('');
  const [bookings, setBookings] = useState([]);

  function load() {
    apiClient.get('/admin/bookings', { params: status ? { status } : {} }).then((res) => setBookings(res.data));
  }

  useEffect(load, [status]);

  async function cancel(id) {
    await apiClient.patch(`/bookings/${id}/status`, { status: 'cancelled' });
    load();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage bookings</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button key={s || 'all'} onClick={() => setStatus(s)}
            className={`px-3.5 py-1.5 rounded-full text-sm border capitalize ${status === s ? 'bg-blue-600 text-white border-ink' : 'bg-white border-border'}`}>
            {s ? s.replace('_', ' ') : 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brandbg text-left text-muted">
            <tr>
              <th className="px-4 py-2">Household</th>
              <th className="px-4 py-2">Helper</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-2">{b.household_name}</td>
                <td className="px-4 py-2">{b.helper_name}</td>
                <td className="px-4 py-2">{b.plan_name}</td>
                <td className="px-4 py-2">{new Date(b.scheduled_date).toLocaleDateString()}</td>
                <td className="px-4 py-2 mono">₹{b.total_price}</td>
                <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-2">
                  {['requested', 'accepted', 'in_progress'].includes(b.status) && (
                    <button onClick={() => cancel(b.id)} className="text-danger text-xs">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-muted text-sm p-4">No bookings found.</p>}
      </div>
    </div>
  );
}
