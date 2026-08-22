import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';

export default function VerifyHelpers() {
  const [status, setStatus] = useState('pending');
  const [helpers, setHelpers] = useState([]);

  function load() {
    apiClient.get('/admin/helpers', { params: { status } }).then((res) => setHelpers(res.data));
  }

  useEffect(load, [status]);

  async function verify(id, newStatus) {
    await apiClient.patch(`/admin/helpers/${id}/verify`, { status: newStatus });
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Verify helpers</h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3.5 py-1.5 rounded-full text-sm border capitalize ${status === s ? 'bg-ink text-white border-ink' : 'bg-white border-border'}`}>
            {s}
          </button>
        ))}
      </div>

      {helpers.length === 0 ? (
        <p className="text-muted">No helpers in this state.</p>
      ) : (
        <div className="space-y-3">
          {helpers.map((h) => (
            <div key={h.id} className="bg-white border border-border rounded-card shadow-card p-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{h.full_name} <span className="text-xs text-muted capitalize">({h.service_type})</span></h3>
                <p className="text-sm text-muted">{h.email} · {h.phone} · {h.city}</p>
                <p className="text-sm text-inksoft mt-1">{h.experience_years} yrs experience</p>
                <p className="text-xs text-muted mt-1">
                  Docs: {h.id_document_url ? 'ID uploaded' : 'No ID'} · {h.background_check_url ? 'Background check uploaded' : 'No background check'}
                </p>
              </div>
              {status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => verify(h.id, 'approved')} className="text-sm bg-success text-white rounded-md px-3 py-1.5">Approve</button>
                  <button onClick={() => verify(h.id, 'rejected')} className="text-sm border border-danger/30 text-danger rounded-md px-3 py-1.5">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
