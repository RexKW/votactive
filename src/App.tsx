import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Kompetisi from './pages/Kompetisi';
import DetailKompetisi from './pages/DetailKompetisi';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminEventForm from './pages/AdminEventForm';
import AdminLogin from './pages/AdminLogin'
import Payment from './pages/Payment';
import './App.css';
import EventOrganizerDashboard from './pages/EventOrganizerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/kompetisi" element={<Kompetisi />} />
      <Route path="/detail-kompetisi/:id" element={<DetailKompetisi />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/register" element={<Register />} />

      {/* Organizer Routes */}
      <Route
        path="/organizer/"
        element={
          <ProtectedRoute requireRole={["admin"]}>
            <EventOrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/create"
        element={
          <ProtectedRoute requireRole={["admin"]}>
            <AdminEventForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/edit/:id"
        element={
          <ProtectedRoute requireRole={["admin"]}>
            <AdminEventForm />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireRole={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create"
        element={
          <ProtectedRoute requireRole={["admin"]}>
            <AdminEventForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRoute requireRole={["admin"]}>
            <AdminEventForm />
          </ProtectedRoute>
        }
      />
      
      {/* Transaction Routes */}
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}