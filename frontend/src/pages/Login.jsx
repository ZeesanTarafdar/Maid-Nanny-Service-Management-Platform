import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'helper') navigate('/helper');
      else navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border border-border rounded-card shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm" placeholder="••••••••" />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium disabled:opacity-50">
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-muted mt-4">
        No account? <Link to="/register" className="underline text-blue-600">Sign up</Link>
      </p>
    </div>
  );
}
