import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiBell, FiClipboard, FiLogOut, FiMap, FiMenu, FiMessageSquare, FiSettings, FiUser, FiX } from 'react-icons/fi';

const links = [
  ['/dashboard', 'Overview', FiActivity],
  ['/analytic', 'Analytics', FiBarChart2],
  ['/feedb', 'Feedback', FiMessageSquare],
  ['/todo', 'Task manager', FiClipboard],
  ['/profile', 'Profile', FiUser],
  ['/settings', 'Settings', FiSettings],
];

const titles = {
  '/dashboard': ['Operations overview', 'Live road intelligence'],
  '/analytic': ['Road analytics', 'Sensor and condition insights'],
  '/feedb': ['Citizen feedback', 'Reports and user sentiment'],
  '/todo': ['Task manager', 'Maintenance follow-ups'],
  '/profile': ['Administrator profile', 'Account information'],
  '/settings': ['System settings', 'Preferences and access'],
};

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [title, subtitle] = titles[location.pathname] || titles['/dashboard'];

  const logout = () => {
    localStorage.removeItem('rhm_token');
    localStorage.removeItem('rhm_admin');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><FiMap /></div>
          <div><strong>Road Health Map</strong><span>Control centre</span></div>
        </div>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon /><span>{label}</span>
            </NavLink>
          ))}
          <button className="nav-item" onClick={logout} style={{ border: 0, background: 'transparent', textAlign: 'left' }}><FiLogOut /><span>Sign out</span></button>
        </nav>
        <div className="system-card">
          <div><strong>System status</strong><i className="status-dot" /></div>
          <p>Sensor dataset and local services are ready for monitoring.</p>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <FiX /> : <FiMenu />}</button>
            <div><div className="topbar-title">{title}</div><div className="topbar-subtitle">{subtitle}</div></div>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications"><FiBell /></button>
            <div className="admin-chip"><div className="avatar">A</div><div><strong>RHM Admin</strong><span>Administrator</span></div></div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
