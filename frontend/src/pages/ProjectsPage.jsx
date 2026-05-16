import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const loadProjects = () => api.get('/projects').then((response) => setProjects(response.data));

  useEffect(() => {
    loadProjects();
  }, []);

  const create = async (event) => {
    event.preventDefault();

    try {
      await api.post('/projects', { title, description });
      setTitle('');
      setDescription('');
      setMessage('Project created');
      loadProjects();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Workspace</p>
        <h1 className="page-title">Projects</h1>
        <p className="mt-2 text-sm text-slate-500">Organize work into clear project areas for the whole team.</p>
      </div>

      {message && <p className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{message}</p>}

      {user?.role === 'admin' && (
        <form onSubmit={create} className="section-card grid gap-4 p-5 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Project title</span>
            <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Description</span>
            <input className="field" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <button className="btn-primary">Create</button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="section-card p-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-950">{project.title}</h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{project.description || 'No description added yet.'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
