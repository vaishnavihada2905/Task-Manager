import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const statusClass = {
  Pending: 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700'
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
    projectId: '',
    assignedTo: ''
  });

  const loadTasks = () => api.get('/tasks').then((response) => setTasks(response.data));

  useEffect(() => {
    loadTasks();
    api.get('/projects').then((response) => setProjects(response.data));

    if (user?.role === 'admin') {
      api.get('/tasks/members/list').then((response) => setMembers(response.data));
    }
  }, [user]);

  const create = async (event) => {
    event.preventDefault();

    try {
      await api.post('/tasks', form);
      setMessage('Task created');
      setForm({ title: '', description: '', status: 'Pending', dueDate: '', projectId: '', assignedTo: '' });
      loadTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to create task');
    }
  };

  const update = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    loadTasks();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Execution</p>
        <h1 className="page-title">Tasks</h1>
        <p className="mt-2 text-sm text-slate-500">Create, assign, and update work across every project.</p>
      </div>

      {message && <p className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{message}</p>}

      {user?.role === 'admin' && (
        <form onSubmit={create} className="section-card grid gap-4 p-5 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Task title</span>
            <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Due date</span>
            <input type="date" className="field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Description</span>
            <textarea className="field min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Project</span>
            <select className="field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: Number(e.target.value) })}>
              <option value="">Select project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">Assignee</span>
            <select className="field" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: Number(e.target.value) })}>
              <option value="">Select member</option>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </label>
          <button className="btn-primary md:col-span-2">Create task</button>
        </form>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <article key={task.id} className="section-card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-950">{task.title}</h2>
                  <span className={`status-pill ${statusClass[task.status] || 'bg-slate-100 text-slate-700'}`}>{task.status}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                  <span>Project: {task.projectTitle}</span>
                  <span>Assignee: {task.assigneeName}</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>

              <select className="field md:w-44" value={task.status} onChange={(e) => update(task.id, e.target.value)}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
