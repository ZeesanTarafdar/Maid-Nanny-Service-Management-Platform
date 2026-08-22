import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiClient.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  const cards = stats
    ? [
        { label: 'Registered households', value: stats.registeredHouseholds },
        { label: 'Total helpers', value: stats.totalHelpers },
        { label: 'Verified helpers', value: stats.verifiedHelpers },
        { label: 'Total bookings', value: stats.totalBookings },
        { label: 'Active bookings', value: stats.activeBookings },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin dashboard</h1>

      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-border rounded-card shadow-card p-4">
            <p className="text-2xl font-bold mono">{c.value}</p>
            <p className="text-xs text-muted mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/admin/verify" className="bg-white border border-border rounded-card shadow-card px-5 py-4 hover:-translate-y-0.5 transition">
          <h3 className="font-semibold">Verify helpers</h3>
          <p className="text-sm text-muted">Approve or reject pending helper profiles</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white border border-border rounded-card shadow-card px-5 py-4 hover:-translate-y-0.5 transition">
          <h3 className="font-semibold">Manage bookings</h3>
          <p className="text-sm text-muted">Monitor and resolve platform-wide bookings</p>
        </Link>
      </div>
    </div>
  );
}
