import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Calendar, WifiOff } from 'lucide-react';
import { getEventById, getCurrentUser } from '../data/store';
import type { VotingEvent } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function DetailKompetisi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<VotingEvent | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const found = getEventById(Number(id));
      setEvent(found);
    }
  }, [id]);

  const handleVote = () => {
    const user = getCurrentUser();
    if (!user) {
      alert("Please login to vote!");
      navigate('/login');
    } else {
      navigate('/payment');
    }
  };

  if (!event) return (
    <div className="votactive-container">
      <Header />
      <div style={{ padding: '40px', textAlign: 'center' }}>Loading... or Event Not Found</div>
      <Footer />
    </div>
  );

  return (
    <div className="votactive-container detail-page">
      <Header />

      <main className="detail-main">
        {/* Event Info */}
        <section className="event-info-section">
          <div className="event-info-wrapper">
            <div className="event-banner-placeholder"></div>
            
            <div className="event-text-content">
              <h1 className="event-detail-title">{event.title}</h1>
              <div className="event-meta">
                <Calendar size={16} />
                <span>{event.date}</span>
              </div>
              
              <div className="event-tags">
                <div className="tag-item orange-text">
                  <WifiOff size={20} />
                  <span>Offline</span>
                </div>
              </div>

              <p className="event-description">{event.description}</p>
              
              <button onClick={handleVote} className="primary-btn" style={{marginTop: '20px', borderRadius: '50px', padding: '12px 32px'}}>
                VOTE NOW
              </button>
            </div>
          </div>
          <div className="wide-grey-bar"></div>
        </section>

        {/* Leaderboard */}
        <section className="leaderboard-section">
          <div className="leaderboard-header">
             <div className="header-box-placeholder"></div>
             <h2 className="leaderboard-title">LEADERBOARD</h2>
             <div className="header-box-placeholder"></div>
          </div>

          <div className="podium-container">
            <div className="podium-spot second">
              <div className="avatar-circle white-circle"></div>
              <div className="podium-base"></div>
            </div>
            <div className="podium-spot first">
              <div className="avatar-circle yellow-circle"></div>
              <div className="podium-base"></div>
            </div>
            <div className="podium-spot third">
              <div className="avatar-circle orange-circle"></div>
              <div className="podium-base"></div>
            </div>
          </div>
        </section>

        {/* Participants / Candidates */}
        <section className="peserta-section">
          <h2 className="section-title">Candidates</h2>
          <div className="peserta-search-bar">
             <Search className="search-icon" size={18} />
             <input type="text" placeholder="Cari Peserta..." />
          </div>

          <div className="event-grid">
            {/* Render mock candidates or a default list if empty */}
            {(event.candidates && event.candidates.length > 0 ? event.candidates : [1, 2, 3]).map((candidate, i) => (
              <div key={i} className="event-card">
                <div className="card-image"></div>
                <div className="card-details">
                  <h3 className="card-title">
                    {typeof candidate === 'object' ? candidate.name : `Candidate ${candidate}`}
                  </h3>
                  <div className="card-footer">
                     <button onClick={handleVote} className="secondary-btn" style={{width: '100%', marginTop: '10px'}}>
                        Vote This
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}