import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';

function DocumentPreviewModal({ url, onClose }) {
  const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = original;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-card shadow-card w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">Document preview</h3>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-muted hover:text-ink text-lg leading-none">&times;</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-brandbg">
          {isImage && (
            <img src={url} alt="Document preview" className="max-w-full max-h-full rounded-md" />
          )}
          {isPdf && (
            <iframe src={url} title="Document preview" className="w-full h-[65vh] rounded-md border border-border bg-white" />
          )}
          {!isImage && !isPdf && (
            <div className="text-center text-sm text-muted">
              Can't preview this file type here.
              <br />
              <a href={url} target="_blank" rel="noreferrer" className="underline text-inksoft">Open it in a new tab instead</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HelperProfileEdit() {
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [myServices, setMyServices] = useState({});
  const [saved, setSaved] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const rawBase = import.meta.env.VITE_API_BASE_URL || '';
  const fileBase = rawBase.replace('/api', '');

  useEffect(() => {
    apiClient.get('/helpers/me/profile').then((res) => setProfile(res.data));
  }, []);

  useEffect(() => {
    if (!profile) return;
    apiClient.get('/service-plans', { params: { serviceType: profile.service_type } }).then((res) => setPlans(res.data));
  }, [profile?.service_type]);

  function update(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  function resolveUrl(url) {
    if (!url) return url;
    return /^https?:\/\//i.test(url) ? url : `${fileBase}${url}`;
  }

  async function saveProfile(e) {
    e.preventDefault();
    const res = await apiClient.patch('/helpers/me/profile', {
      experienceYears: profile.experience_years,
      bio: profile.bio,
      skills: typeof profile.skills === 'string' ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean) : profile.skills,
      hourlyRate: profile.hourly_rate || null,
      monthlyRate: profile.monthly_rate || null,
      yearlyRate: profile.yearly_rate || null,
    });
    setProfile(res.data);
    setSaved('Profile updated.');
    setTimeout(() => setSaved(''), 2500);
  }

  async function togglePlan(planId, checked) {
    if (!checked) return; // simple demo: adding only, removal can be done via admin/service update
    await apiClient.post('/helpers/me/services', { servicePlanId: planId });
    setMyServices((m) => ({ ...m, [planId]: true }));
  }

  async function uploadDocs(e) {
    e.preventDefault();
    const idFile = e.target.idDocument.files[0];
    const bgFile = e.target.backgroundCheck.files[0];

    if (!idFile && !bgFile) {
      setSaved('Please choose at least one file to upload.');
      setTimeout(() => setSaved(''), 2500);
      return;
    }

    try {
      let idDocumentUrl, backgroundCheckUrl;

      if (idFile) {
        const form = new FormData();
        form.append('file', idFile);
        const res = await apiClient.post('/uploads', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        idDocumentUrl = res.data.url;
      }

      if (bgFile) {
        const form = new FormData();
        form.append('file', bgFile);
        const res = await apiClient.post('/uploads', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        backgroundCheckUrl = res.data.url;
      }

      const profileRes = await apiClient.post('/helpers/me/documents', { idDocumentUrl, backgroundCheckUrl });
      setProfile(profileRes.data);
      setSaved('Documents submitted for verification.');
    } catch (err) {
      setSaved(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setTimeout(() => setSaved(''), 2500);
    }
  }

  if (!profile) return <div className="p-10 text-center text-muted">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit your profile</h1>

      <form onSubmit={saveProfile} className="bg-white border border-border rounded-card shadow-card p-5 space-y-3">
        <h2 className="font-semibold">Profile details</h2>
        <div>
          <label className="block text-sm mb-1">Years of experience</label>
          <input type="number" step="0.5" value={profile.experience_years || ''}
            onChange={(e) => update('experience_years', e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea value={profile.bio || ''} onChange={(e) => update('bio', e.target.value)} rows={3}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Skills (comma separated)</label>
          <input value={Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || '')}
            onChange={(e) => update('skills', e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Hourly rate</label>
            <input type="number" value={profile.hourly_rate || ''} onChange={(e) => update('hourly_rate', e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Monthly rate</label>
            <input type="number" value={profile.monthly_rate || ''} onChange={(e) => update('monthly_rate', e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Yearly rate</label>
            <input type="number" value={profile.yearly_rate || ''} onChange={(e) => update('yearly_rate', e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="submit" className="bg-ink text-white rounded-md px-4 py-2 text-sm font-medium">Save profile</button>
      </form>

      <div className="bg-white border border-border rounded-card shadow-card p-5 space-y-3">
        <h2 className="font-semibold">Offered plans</h2>
        {plans.map((p) => (
          <label key={p.id} className="flex items-center justify-between text-sm border-b border-border last:border-0 py-2">
            <span>{p.name} <span className="text-muted">· ₹{p.base_price} ({p.cycle})</span></span>
            <input type="checkbox" checked={!!myServices[p.id]} onChange={(e) => togglePlan(p.id, e.target.checked)} />
          </label>
        ))}
      </div>

      <form onSubmit={uploadDocs} className="bg-white border border-border rounded-card shadow-card p-5 space-y-3">
        <h2 className="font-semibold">Identity & background verification</h2>
        <p className="text-sm text-muted">
          Current status: <span className="capitalize">{profile.verification_status}</span>
        </p>

        <div>
          <label className="block text-sm mb-1">ID document (Aadhaar / PAN / passport)</label>
          {profile.id_document_url && (
            <button
              type="button"
              onClick={() => setPreviewUrl(resolveUrl(profile.id_document_url))}
              className="w-full flex items-center justify-between text-sm bg-brandbg border border-border rounded-md px-3 py-2 mb-2 text-inksoft"
            >
              <span>✓ {profile.id_document_url.split('/').pop()}</span>
              <span className="text-xs underline">View</span>
            </button>
          )}
          <input type="file" name="idDocument" accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => update('idDocumentName', e.target.files[0]?.name || '')}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          {profile.idDocumentName && (
            <p className="text-xs text-muted mt-1">Selected: {profile.idDocumentName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Background check document</label>
          {profile.background_check_url && (
            <button
              type="button"
              onClick={() => setPreviewUrl(resolveUrl(profile.background_check_url))}
              className="w-full flex items-center justify-between text-sm bg-brandbg border border-border rounded-md px-3 py-2 mb-2 text-inksoft"
            >
              <span>✓ {profile.background_check_url.split('/').pop()}</span>
              <span className="text-xs underline">View</span>
            </button>
          )}
          <input type="file" name="backgroundCheck" accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => update('backgroundCheckName', e.target.files[0]?.name || '')}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" />
          {profile.backgroundCheckName && (
            <p className="text-xs text-muted mt-1">Selected: {profile.backgroundCheckName}</p>
          )}
        </div>

        <button type="submit" className="bg-ink text-white rounded-md px-4 py-2 text-sm font-medium">
          Submit documents for verification
        </button>
      </form>

      {saved && <p className="text-success text-sm">{saved}</p>}

      {previewUrl && (
        <DocumentPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
}