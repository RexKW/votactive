import React, { useState } from 'react'
import { login } from '../apis/UserCRUD';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const navigate = useNavigate();

    // const handleLogin = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   login(username, role);
    //   // Redirect based on role
    //   if (role === 'admin') navigate('/admin');
    //   else navigate('/');
    // };

    const loginAdmin = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            const response = await login(username, password)
            console.log('API Response:', response);
            if (!response.data.token) {
                alert("User not found")
            } else {
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('token', response.data.token);
                navigate("/admin/dashboard");

            }

        } catch (error) {
            console.log(error)
        }


    }
    return (
        <div className="votactive-container">
      <Header />
      <main className="auth-main">
        <div className="auth-card">
          <h2 className="section-title" style={{textAlign: 'center'}}>Admin Login</h2>
          <form onSubmit={loginAdmin} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your username"
              />
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
    )
}

