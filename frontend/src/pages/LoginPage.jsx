import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const useDemo = (email, password) => setForm({ email, password });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">TaskFlow</p>
            <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Run projects, assign work, and keep every task visible.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              A clean workspace for admins and members to manage shared projects, due dates, and task progress.
            </p>
          </div>

          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {['Projects', 'Tasks', 'Progress'].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-1 text-xs text-slate-400">Track team work</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="section-card p-6 text-slate-900 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Sign in to manage your team tasks.</p>
          </div>

          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Email</span>
              <input
                className="field"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                className="field"
                placeholder="admin123"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button type="button" className="btn-secondary" onClick={() => useDemo('admin@example.com', 'admin123')}>
              Use admin demo
            </button>
            <button type="button" className="btn-secondary" onClick={() => useDemo('member@example.com', 'member123')}>
              Use member demo
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            New user? <Link to="/signup" className="font-semibold text-emerald-700">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
