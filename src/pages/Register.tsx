import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // For simulation, just redirect to login
    alert("Registration successful! Please login.");
    navigate('/login');
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="auth-main">
        <div className="auth-card">
          <h2 className="section-title" style={{textAlign: 'center'}}>Register</h2>
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="********" />
            </div>
            <button type="submit" className="primary-btn">Register</button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}