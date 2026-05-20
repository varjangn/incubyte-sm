import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2>Incubyte</h2>}
        <button onClick={toggleSidebar} className="toggle-btn" aria-label="Toggle Sidebar" title="Toggle Sidebar">
          {isCollapsed ? '❯' : '❮'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link
          to="/employees"
          className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`}
          title="Employees"
        >
          <span className="icon">👥</span>
          {!isCollapsed && <span className="text">Employees</span>}
        </Link>
        <Link
          to="/insights"
          className={`nav-item ${location.pathname === '/insights' ? 'active' : ''}`}
          title="Insights"
        >
          <span className="icon">📊</span>
          {!isCollapsed && <span className="text">Insights</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
