// import React, { useEffect, useState } from 'react';
// import apiClient from '../../api/client';
// import HelperCard from '../../components/HelperCard';

// const SERVICE_TABS = [
//   { value: '', label: 'All' },
//   { value: 'maid', label: 'Maids' },
//   { value: 'babysitter', label: 'Babysitters' },
//   { value: 'nanny', label: 'Nannies' },
// ];

// export default function BrowseHelpers() {
//   const [serviceType, setServiceType] = useState('');
//   const [city, setCity] = useState('');
//   const [plan, setPlan] = useState('');
//   const [helpers, setHelpers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     const params = {};
//     if (serviceType) params.serviceType = serviceType;
//     if (city) params.city = city;
//     if (plan) params.plan = plan;
//     apiClient
//       .get('/helpers', { params })
//       .then((res) => setHelpers(res.data))
//       .finally(() => setLoading(false));
//   }, [serviceType, city, plan]);

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-8">
//       <h1 className="text-2xl font-bold mb-1">Find verified help near you</h1>
//       <p className="text-muted mb-6">Browse maids, babysitters and nannies who have passed background verification.</p>

//       <div className="flex flex-wrap gap-2 mb-4">
//         {SERVICE_TABS.map((t) => (
//           <button
//             key={t.value}
//             onClick={() => setServiceType(t.value)}
//             className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
//               serviceType === t.value ? 'bg-ink text-white border-ink' : 'bg-white border-border text-inksoft'
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-wrap gap-3 mb-6">
//         <input
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City e.g. Kolkata"
//           className="border border-border rounded-md px-3 py-2 text-sm bg-white"
//         />
//         <select value={plan} onChange={(e) => setPlan(e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm bg-white">
//           <option value="">Any plan</option>
//           <option value="hourly">Hourly</option>
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>
//       </div>

//       {loading ? (
//         <p className="text-muted">Loading helpers…</p>
//       ) : helpers.length === 0 ? (
//         <p className="text-muted">No verified helpers match these filters yet.</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {helpers.map((h) => <HelperCard key={h.id} helper={h} />)}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';
import HelperCard from '../../components/HelperCard';

const SERVICE_TABS = [
  { value: '', label: 'All' },
  { value: 'maid', label: 'Maids' },
  { value: 'babysitter', label: 'Babysitters' },
  { value: 'nanny', label: 'Nannies' },
];

export default function BrowseHelpers() {
  const [searchParams] = useSearchParams();
  const [serviceType, setServiceType] = useState(searchParams.get('serviceType') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [plan, setPlan] = useState(searchParams.get('plan') || '');
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (serviceType) params.serviceType = serviceType;
    if (city) params.city = city;
    if (plan) params.plan = plan;
    apiClient
      .get('/helpers', { params })
      .then((res) => setHelpers(res.data))
      .finally(() => setLoading(false));
  }, [serviceType, city, plan]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">Find verified help near you</h1>
      <p className="text-muted mb-6">Browse maids, babysitters and nannies who have passed background verification.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {SERVICE_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setServiceType(t.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
              serviceType === t.value ? 'bg-ink text-white border-ink' : 'bg-white border-border text-inksoft'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City e.g. Kolkata"
          className="border border-border rounded-md px-3 py-2 text-sm bg-white"
        />
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm bg-white">
          <option value="">Any plan</option>
          <option value="hourly">Hourly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted">Loading helpers…</p>
      ) : helpers.length === 0 ? (
        <p className="text-muted">No verified helpers match these filters yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpers.map((h) => <HelperCard key={h.id} helper={h} />)}
        </div>
      )}
    </div>
  );
}