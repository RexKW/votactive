import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../context/userAuthContext';
import { getUserRole } from '../apis/UserCRUD';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   login(username, role);
  //   // Redirect based on role
  //   if (role === 'admin') navigate('/admin');
  //   else navigate('/');
  // };

  const fetchAUser = async (e: React.FormEvent) =>{
        e.preventDefault();
        console.log("Attempting login with:", { username, password });
        try{
            const credential = await logIn(username, password);
            const uid = credential.user?.uid;
            if(uid){
              const role = await getUserRole(uid);
              // route based on role
              if(role === 'admin') navigate('/admin/dashboard');
              else if(role === 'event_organizer') navigate('/organizer');
              else navigate('/login');
            } else {
              navigate('/');
            }
        }catch(error){
            console.log(error)
            alert('Login failed')
        }
    }

  return (
    <div className="votactive-container">
      <Header />
      <main className="auth-main">
        <div className="auth-card">
          <h2 className="section-title" style={{textAlign: 'center'}}>Login</h2>
          <form onSubmit={fetchAUser} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              <label className='mt-5'>Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {/* <div className="form-group">
              <label>Role (Simulation)</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')}>
                <option value="user">User (Voter)</option>
                <option value="admin">Admin (Organizer)</option>
              </select>
            </div> */}
            <button type="submit" className="primary-btn mt-10">Login</button>
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