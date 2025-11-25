import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, role);
    // Redirect based on role
    if (role === 'admin') navigate('/admin');
    else navigate('/');
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="auth-main">
        <div className="auth-card">
          <h2 className="section-title" style={{textAlign: 'center'}}>Login</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label>Role (Simulation)</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')}>
                <option value="user">User (Voter)</option>
                <option value="admin">Admin (Organizer)</option>
              </select>
            </div>
            <button type="submit" className="primary-btn">Login</button>
          </form>
          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}