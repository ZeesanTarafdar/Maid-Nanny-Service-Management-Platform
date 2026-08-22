import React from 'react';
import { Link } from 'react-router-dom';

const TYPE_STYLES = {
  maid: 'bg-maidlight text-maid',
  babysitter: 'bg-nannylight text-nanny',
  nanny: 'bg-nannylight text-nanny',
};

export default function HelperCard({ helper }) {
  const price = helper.hourly_rate
    ? `₹${helper.hourly_rate}/hr`
    : helper.monthly_rate
    ? `₹${helper.monthly_rate}/mo`
    : 'Contact for pricing';

  return (
    <Link
      to={`/helpers/${helper.id}`}
      className="block bg-white border border-border rounded-card shadow-card p-5 hover:-translate-y-0.5 transition"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{helper.full_name}</h3>
          <p className="text-sm text-muted">{helper.city}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${TYPE_STYLES[helper.service_type] || ''}`}>
          {helper.service_type}
        </span>
      </div>
      <p className="text-sm text-inksoft line-clamp-2 mb-3">{helper.bio || 'Experienced, verified home helper.'}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="mono text-muted">{helper.experience_years} yrs experience</span>
        <span className="mono font-semibold">{price}</span>
      </div>
      <div className="flex items-center gap-1 mt-2 text-sm text-warning">
        ★ {Number(helper.rating_avg).toFixed(1)}
        <span className="text-muted">({helper.rating_count})</span>
      </div>
    </Link>
  );
}
