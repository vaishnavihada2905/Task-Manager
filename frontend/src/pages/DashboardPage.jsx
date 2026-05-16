import { useEffect, useState } from 'react';
import api from '../services/api';

const statStyles = {
  total: 'bg-slate-900 text-white',
  completed: 'bg-emerald-600 text-white',
  pending: 'bg-amber-500 text-white',
  overdue: 'bg-rose-600 text-white'
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tasks/dashboard/stats')
      .then((response) => setStats(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>;
  }

  if (!stats) {
    return <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>;
  }

  const cards = [
    { label: 'Total tasks', value: stats.total, key: 'total' },
    { label: 'Completed', value: stats.completed, key: 'completed' },
    { label: 'Pending', value: stats.pending, key: 'pending' },
    { label: 'Overdue', value: stats.overdue, key: 'overdue' }
  ];
  const progress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Overview</p>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <p className="text-sm text-slate-500">Completion rate: <span className="font-semibold text-slate-900">{progress}%</span></p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className={`rounded-lg p-5 shadow-sm ${statStyles[card.key]}`}>
            <p className="text-sm font-semibold opacity-80">{card.label}</p>
            <p className="mt-4 text-4xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="section-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Team progress</h2>
            <p className="mt-1 text-sm text-slate-500">Completed tasks compared with all active work.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{progress}%</span>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>
    </div>
  );
}
