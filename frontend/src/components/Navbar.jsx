import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() { const { user, logout } = useAuth(); return <nav className='bg-white shadow p-4 mb-6'><div className='max-w-6xl mx-auto flex justify-between'><div className='space-x-4'><Link to='/dashboard'>Dashboard</Link><Link to='/projects'>Projects</Link><Link to='/tasks'>Tasks</Link></div><div>{user && <span className='mr-4'>{user.name} ({user.role})</span>}<button className='bg-red-500 text-white px-3 py-1 rounded' onClick={logout}>Logout</button></div></div></nav>; }
