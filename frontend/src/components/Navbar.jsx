import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-lg font-bold text-slate-950">TaskFlow</p>
            <p className="text-xs font-medium text-slate-500">Team task manager</p>
          </div>
          <div className="flex gap-1">
            <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>
            <NavLink className={navClass} to="/projects">Projects</NavLink>
            <NavLink className={navClass} to="/tasks">Tasks</NavLink>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {user && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
          )}
          <button className="btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
