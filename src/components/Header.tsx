import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../data/store';

export default function Header() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="votactive-header">
      <div className="votactive-header-content">
        <Link to="/" className="votactive-logo" style={{ textDecoration: 'none' }}>
          <span className="logo-box orange">vot</span>
          <span className="logo-text white">active</span>
        </Link>
        <nav className="votactive-nav">
          <Link to="/">Beranda</Link>
          <Link to="/kompetisi">Kompetisi</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="nav-highlight">Dashboard</Link>}
              <button onClick={handleLogout} className="nav-btn">Logout ({user.username})</button>
            </>
          ) : (
            <Link to="/login" className="nav-highlight">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}