import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('household');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', city: '', address: '', serviceType: 'maid',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await register({ ...form, role });
      if (user.role === 'helper') navigate('/helper');
      else navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white border border-border rounded-card shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Create your account</h2>

      <div className="flex bg-brandbg rounded-md p-1 mb-4 text-sm">
        {['household', 'helper'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-1.5 rounded-md capitalize transition ${role === r ? 'bg-white shadow-card font-medium' : 'text-muted'}`}
          >
            {r === 'household' ? 'Family / household' : 'Maid, babysitter or nanny'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="e.g. Ananya Sen" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">Mobile number</label>
          <input className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="98765 43210" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Kolkata" />
        </div>
        <div>
          <label className="block text-sm mb-1">Address</label>
          <input className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street, area" />
        </div>

        {role === 'helper' && (
          <div>
            <label className="block text-sm mb-1">Service type</label>
            <select className="w-full border border-border rounded-md px-3 py-2 text-sm"
              value={form.serviceType} onChange={(e) => update('serviceType', e.target.value)}>
              <option value="maid">Maid / housekeeping</option>
              <option value="babysitter">Babysitter</option>
              <option value="nanny">Nanny</option>
            </select>
          </div>
        )}

        {error && <p className="text-danger text-sm">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full bg-ink text-white rounded-md py-2.5 text-sm font-medium disabled:opacity-50">
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-muted mt-4">
        Already have an account? <Link to="/login" className="text-ink underline">Log in</Link>
      </p>
    </div>
  );
}
