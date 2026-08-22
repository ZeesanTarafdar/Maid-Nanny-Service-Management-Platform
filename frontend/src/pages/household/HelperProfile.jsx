import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import BookingModal from '../../components/BookingModal';

export default function HelperProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [helper, setHelper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [bookedMsg, setBookedMsg] = useState('');

  useEffect(() => {
    apiClient.get(`/helpers/${id}`).then((res) => setHelper(res.data));
    apiClient.get(`/reviews/helper/${id}`).then((res) => setReviews(res.data));
  }, [id]);

  function handleBookClick(plan) {
    if (!user) {
      navigate('/login');
      return;
    }
    setActivePlan(plan);
  }

  if (!helper) return <div className="p-10 text-center text-muted">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white border border-border rounded-card shadow-card p-6 mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">{helper.full_name}</h1>
            <p className="text-muted">{helper.city} · {helper.experience_years} yrs experience</p>
          </div>
          <span className="text-warning text-sm">★ {Number(helper.rating_avg).toFixed(1)} ({helper.rating_count})</span>
        </div>
        <p className="text-inksoft mt-3">{helper.bio || 'Experienced, verified home helper.'}</p>
        {helper.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {helper.skills.map((s) => (
              <span key={s} className="text-xs bg-brandbg border border-border rounded-full px-2.5 py-1">{s}</span>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">Available plans</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {helper.plans.length === 0 && <p className="text-muted text-sm">No active plans yet.</p>}
        {helper.plans.map((p) => (
          <div key={p.service_id} className="bg-white border border-border rounded-card shadow-card p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-xs text-muted capitalize">{p.cycle}</p>
              <p className="text-sm text-inksoft mt-1">{p.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="mono font-semibold">₹{p.price}</span>
              <button onClick={() => handleBookClick(p)} className="text-sm bg-ink text-white px-3 py-1.5 rounded-md">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-muted text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-border rounded-card p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{r.household_name}</span>
                <span className="text-warning">★ {r.rating}</span>
              </div>
              <p className="text-sm text-inksoft">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {activePlan && (
        <BookingModal
          helper={helper}
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onBooked={() => {
            setActivePlan(null);
            setBookedMsg('Booking request sent! Track it from My bookings.');
          }}
        />
      )}
      {bookedMsg && (
        <div className="fixed bottom-6 right-6 bg-ink text-white px-4 py-3 rounded-md text-sm shadow-card">
          {bookedMsg}
        </div>
      )}
    </div>
  );
}
