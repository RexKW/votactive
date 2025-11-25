import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { voteForCandidate, getCurrentUser } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(3600);
  const vaNumber = "8077123456789012";

  const { eventId, candidateId } = location.state || {};

  useEffect(() => {
    if (!eventId || !candidateId) {
      alert("Invalid transaction details");
      navigate('/');
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventId, candidateId, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vaNumber);
    alert("VA Number copied!");
  };

  const handleCheckPayment = () => {
    // Simulate Payment Success
    setTimeout(() => {
      const user = getCurrentUser();
      if (user && eventId && candidateId) {
        const success = voteForCandidate(eventId, candidateId, user.username);
        if (success) {
          alert("Payment Successful! Your vote has been recorded.");
          navigate(`/detail-kompetisi/${eventId}`);
        } else {
          navigate('/');
        }
      }
    }, 1000);
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="main-content payment-page">
        <div className="payment-card">
          <div className="payment-header">
            <h2>Pembayaran</h2>
            <div className="timer-badge">
              Sisa Waktu: {formatTime(timeLeft)}
            </div>
          </div>

          <div className="payment-body">
            <div className="bca-logo">
              <div className="bank-logo">BCA</div>
              <span>Virtual Account</span>
            </div>

            <div className="va-section">
              <label>Nomor Virtual Account</label>
              <div className="va-display">
                <span className="va-number">{vaNumber}</span>
                <button onClick={copyToClipboard} className="copy-btn">
                  <Copy size={18} /> Salin
                </button>
              </div>
            </div>

            <div className="payment-details">
              <div className="detail-row">
                <span>Total Pembayaran</span>
                <span className="total-price">Rp 20.000,00</span>
              </div>
            </div>

            <div className="payment-instructions">
              <h3>Cara Pembayaran:</h3>
              <ol>
                <li>Buka aplikasi BCA Mobile</li>
                <li>Pilih m-Transfer &gt; BCA Virtual Account</li>
                <li>Masukkan nomor VA di atas</li>
                <li>Periksa detail dan konfirmasi pembayaran</li>
              </ol>
            </div>

            <button onClick={handleCheckPayment} className="primary-btn full-width">
              Cek Status Pembayaran
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}