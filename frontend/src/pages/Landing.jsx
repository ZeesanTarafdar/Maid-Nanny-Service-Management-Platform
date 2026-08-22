// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Landing() {
//   return (
//     <div className="max-w-5xl mx-auto px-6 py-16">
//       <h1 className="text-4xl font-bold mb-4">Maid & Nanny Service Management Platform</h1>
//       <p className="text-inksoft text-lg mb-8 max-w-2xl">
//         A centralized platform connecting households with verified maids, babysitters and nannies —
//         with flexible hourly, monthly and yearly plans, and trust built in through profile
//         verification, booking management and service tracking.
//       </p>
//       <div className="flex gap-3 mb-14">
//         <Link to="/browse" className="bg-ink text-white px-5 py-2.5 rounded-md text-sm font-medium">
//           Browse helpers
//         </Link>
//         <Link to="/register" className="border border-border px-5 py-2.5 rounded-md text-sm font-medium bg-white">
//           Join as a helper
//         </Link>
//       </div>

//       <div className="grid sm:grid-cols-3 gap-4">
//         {[
//           { title: 'Verified profiles', desc: 'Every helper is background-checked and admin-approved before going live.' },
//           { title: 'Flexible plans', desc: 'Book by the hour, or lock in a monthly or yearly plan.' },
//           { title: 'Full transparency', desc: 'Track bookings, ratings and service history in one place.' },
//         ].map((f) => (
//           <div key={f.title} className="bg-white border border-border rounded-card shadow-card p-5">
//             <h3 className="font-semibold mb-1">{f.title}</h3>
//             <p className="text-sm text-muted">{f.desc}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ICONS = {
  shield: (
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  chart: (
    <path d="M4 20V10M12 20V4M20 20v-7" />
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M12 9v6" />
    </>
  ),
  swap: (
    <path d="M4 7h13l-3-3M20 17H7l3 3" />
  ),
  handshake: (
    <path d="M3 12l4-4 4 3 4-3 6 4-3 3-3-2-3 3-3-3-2 2z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  spark: (
    <path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z" />
  ),
};

function Icon({ name, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      {ICONS[name]}
    </svg>
  );
}

const SERVICES = [
  { type: 'maid', label: 'Maids', desc: 'Daily housekeeping and deep cleaning, on your schedule.', from: '₹250/hr', tone: 'maid' },
  { type: 'babysitter', label: 'Babysitters', desc: 'On-demand, first-aid trained child care for evenings and weekends.', from: '₹300/hr', tone: 'nanny' },
  { type: 'nanny', label: 'Nannies', desc: 'Full-time daytime care, from live-out to annual contracts.', from: '₹17,000/mo', tone: 'nanny' },
];

const STATS = [
  { value: '1,200+', label: 'Registered households' },
  { value: '340+', label: 'Verified helpers' },
  { value: '12', label: 'Cities served' },
  { value: '4.7★', label: 'Average rating' },
];

const STEPS = [
  { title: 'Search & filter', desc: 'Tell us your city, service type and the plan that fits — hourly, monthly or yearly.' },
  { title: 'Compare verified profiles', desc: 'Every profile shown has passed ID and background verification before it goes live.' },
  { title: 'Book in a few taps', desc: 'Pick a plan, choose a date and address, and send the request — no phone tag required.' },
  { title: 'Track and rate the service', desc: 'Follow the booking status end to end, then leave a rating once the job is done.' },
];

const WHY = [
  { icon: 'shield', title: 'Verified, every time', desc: 'ID and background checks are required before a helper can appear in search.' },
  { icon: 'coin', title: 'No hidden fees', desc: 'The price you see on a plan is the price you pay — no surprise commissions.' },
  { icon: 'swap', title: 'Flexible plans', desc: 'Switch between hourly, monthly and yearly billing as your needs change.' },
  { icon: 'chart', title: 'Full history', desc: 'Every booking, cancellation and rating is logged and visible to you.' },
  { icon: 'handshake', title: 'Dispute support', desc: 'Our admin team reviews complaints and steps in when something goes wrong.' },
  { icon: 'clock', title: 'Fast responses', desc: "Helpers accept or decline requests quickly so you're never left waiting." },
];

const TESTIMONIALS = [
  { name: 'Ritu Banerjee', city: 'Kolkata', quote: 'Found a reliable nanny within two days. The verification badge made the decision easy.' },
  { name: 'Arjun Mehta', city: 'Howrah', quote: 'Booking by the hour for weekend cleaning has been a game changer for our family.' },
  { name: 'Sneha Kapoor', city: 'Kolkata', quote: 'Being able to track booking status and leave a review afterward builds real trust.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('');
  const [city, setCity] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceType) params.set('serviceType', serviceType);
    if (city) params.set('city', city);
    navigate(`/browse${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <div>
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-nannylight text-nanny text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Icon name="spark" className="w-3.5 h-3.5" /> Verified helpers, flexible plans
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Trusted maids, babysitters &amp; nannies — booked in minutes
            </h1>
            <p className="text-inksoft text-lg mb-7 max-w-xl">
              A centralized platform connecting households with background-verified domestic
              help, with flexible hourly, monthly and yearly plans, and full transparency from
              booking to service tracking.
            </p>

            <form onSubmit={handleSearch} className="bg-brandbg border border-border rounded-card p-3 flex flex-col sm:flex-row gap-2 mb-4">
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="border border-border rounded-md px-3 py-2.5 text-sm bg-white sm:w-44"
              >
                <option value="">Any service</option>
                <option value="maid">Maid</option>
                <option value="babysitter">Babysitter</option>
                <option value="nanny">Nanny</option>
              </select>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City e.g. Kolkata"
                className="border border-border rounded-md px-3 py-2.5 text-sm bg-white flex-1"
              />
              <button type="submit" className="bg-ink text-white rounded-md px-5 py-2.5 text-sm font-medium flex items-center justify-center gap-2">
                <Icon name="search" className="w-4 h-4" /> Search helpers
              </button>
            </form>

            <div className="flex gap-3">
              <Link to="/browse" className="text-sm font-medium text-inksoft underline underline-offset-2">
                Browse all helpers
              </Link>
              <span className="text-border">·</span>
              <Link to="/register" className="text-sm font-medium text-inksoft underline underline-offset-2">
                Join as a helper
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <Link
                key={s.type}
                to={`/browse?serviceType=${s.type}`}
                className={`col-span-2 sm:col-span-1 bg-white border border-border rounded-card shadow-card p-5 hover:-translate-y-0.5 transition ${s.type === 'maid' ? 'sm:col-span-2' : ''}`}
              >
                <span className={`inline-flex w-9 h-9 rounded-full items-center justify-center mb-3 ${s.tone === 'maid' ? 'bg-maidlight text-maid' : 'bg-nannylight text-nanny'}`}>
                  <Icon name="shield" className="w-4.5 h-4.5" />
                </span>
                <h3 className="font-semibold mb-1">{s.label}</h3>
                <p className="text-sm text-muted mb-2">{s.desc}</p>
                <p className="text-sm font-semibold mono">From {s.from}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold mono">{s.value}</p>
              <p className="text-xs text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-2">How Homehand works</h2>
        <p className="text-muted mb-8 max-w-xl">From search to a completed job, in four simple steps.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bg-white border border-border rounded-card shadow-card p-5">
              <span className="mono text-xs text-muted">Step {i + 1}</span>
              <h3 className="font-semibold mt-1 mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Why families choose Homehand</h2>
          <p className="text-muted mb-8 max-w-xl">Built around trust, transparency and flexibility.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="flex gap-3">
                <span className="shrink-0 w-10 h-10 rounded-full bg-nannylight text-nanny flex items-center justify-center">
                  <Icon name={w.icon} className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{w.title}</h3>
                  <p className="text-sm text-muted">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-2">What families are saying</h2>
        <p className="text-muted mb-8 max-w-xl">Real bookings from households across our launch cities.</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-border rounded-card shadow-card p-5">
              <div className="text-warning text-sm mb-3">★★★★★</div>
              <p className="text-sm text-inksoft mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted">{t.city}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-nannylight border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1.5">Ready to find verified help?</h2>
            <p className="text-inksoft">Sign up in under a minute — no commission, no monthly fees.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/browse" className="bg-ink text-white px-5 py-2.5 rounded-md text-sm font-medium">
              Browse helpers
            </Link>
            <Link to="/register" className="border border-border px-5 py-2.5 rounded-md text-sm font-medium bg-white">
              Join as a helper
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}