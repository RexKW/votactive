import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Kompetisi from './pages/kompetisi';
import DetailKompetisi from './pages/DetailKompetisi'; // Import the new page
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kompetisi" element={<Kompetisi />} />
      {/* Add this new route */}
      <Route path="/detail-kompetisi" element={<DetailKompetisi />} />
    </Routes>
  );
}