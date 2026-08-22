import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

const NEXT_ACTIONS = {
  requested: [
    { status: 'accepted', label: 'Accept', style: 'bg-success text-white' },
    { status: 'rejected', label: 'Decline', style: 'bg-white border border-danger/30 text-danger' },
  ],
  accepted: [{ status: 'in_progress', label: 'Start service', style: 'bg-nanny text-white' }],
  in_progress: [{ status: 'completed', label: 'Mark completed', style: 'bg-success text-white' }],
};

export default function HelperDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('requests');

  function load() {
    apiClient.get('/helpers/me/profile').then((res) => setProfile(res.data));
    apiClient.get('/bookings/mine').then((res) => setBookings(res.data));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    await apiClient.patch(`/bookings/${id}/status`, { status });
    load();
  }

  const earnings = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  const filtered =
    tab === 'requests'
      ? bookings.filter((b) => ['requested', 'accepted', 'in_progress'].includes(b.status))
      : bookings.filter((b) => ['completed', 'rejected', 'cancelled'].includes(b.status));

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Helper dashboard</h1>
          {profile && (
            <p className="text-muted text-sm mt-1">
              {profile.service_type} · <StatusBadge status={profile.verification_status} />
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Earnings (view-only)</p>
          <p className="text-xl font-semibold mono">₹{earnings}</p>
        </div>
      </div>

      {profile && profile.verification_status !== 'approved' && (
        <div className="bg-warninglight text-warning rounded-card p-4 mb-6 text-sm">
          Your profile is {profile.verification_status}. You'll appear in search results once an admin approves it.
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {[{ id: 'requests', label: 'Active jobs' }, { id: 'history', label: 'History' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm border ${tab === t.id ? 'bg-blue-600 text-white border-ink' : 'bg-white border-border'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">Nothing here yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white border border-border rounded-card shadow-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{b.household_name}</h3>
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
                  {(NEXT_ACTIONS[b.status] || []).map((a) => (
                    <button key={a.status} onClick={() => updateStatus(b.id, a.status)}
                      className={`text-sm rounded-md px-3 py-1.5 ${a.style}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
