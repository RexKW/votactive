import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Kompetisi from './pages/Kompetisi';
import DetailKompetisi from './pages/DetailKompetisi';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminEventForm from './pages/AdminEventForm';
import Payment from './pages/Payment';
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/kompetisi" element={<Kompetisi />} />
      <Route path="/detail-kompetisi/:id" element={<DetailKompetisi />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/create" element={<AdminEventForm />} />
      <Route path="/admin/edit/:id" element={<AdminEventForm />} />
      
      {/* Transaction Routes */}
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}