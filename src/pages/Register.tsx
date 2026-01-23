import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';
import { useState } from 'react';
import { register as firebaseRegister } from '../apis/UserCRUD';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await firebaseRegister(fullName, email, password);
      alert('Registration successful! Please login.');
      navigate('/login');
    }catch(error){
      console.error(error);
      alert('Registration failed');
    }
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
              <input value={fullName} onChange={(e)=>setFullName(e.target.value)} type="text" required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required placeholder="********" />
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