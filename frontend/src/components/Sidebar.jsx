import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Incubyte</h2>
      </div>
      <nav className="sidebar-nav">
        <Link
          to="/employees"
          className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`}
        >
          Employees
        </Link>
        <Link
          to="/insights"
          className={`nav-item ${location.pathname === '/insights' ? 'active' : ''}`}
        >
          Insights
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
