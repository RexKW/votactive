import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Calendar, WifiOff, CheckCircle } from 'lucide-react';
import { getEventById, getCurrentUser } from '../data/store';
import type { VotingEvent } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function DetailKompetisi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<VotingEvent | undefined>(undefined);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

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
      return;
    }
    
    if (!selectedCandidateId) {
      alert("Please select a candidate first!");
      return;
    }

    navigate('/payment', { 
      state: { 
        eventId: event?.id, 
        candidateId: selectedCandidateId 
      } 
    });
  };

  if (!event) return (
    <div className="votactive-container">
      <Header />
      <div style={{ padding: '40px', textAlign: 'center' }}>Loading... or Event Not Found</div>
      <Footer />
    </div>
  );

  // Sort candidates by votes descending (Highest first)
  const sortedCandidates = [...event.candidates].sort((a, b) => b.votes - a.votes);

  // We need at least 1 candidate to show a podium.
  // The layout is tricky: Center is 1st (index 0), Left is 2nd (index 1), Right is 3rd (index 2)
  
  return (
    <div className="votactive-container detail-page">
      <Header />

      <main className="detail-main">
        {/* Event Info */}
        <section className="event-info-section">
          <div className="event-info-wrapper">
            <div className="event-banner-placeholder" style={{
              backgroundImage: event.image ? `url(${event.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: event.image ? 'transparent' : '#FCD34D'
            }}></div>
            
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

        {/* Leaderboard Section */}
        <section className="leaderboard-section">
          <div className="leaderboard-header">
             <div className="header-box-placeholder"></div>
             <h2 className="leaderboard-title">LEADERBOARD</h2>
             <div className="header-box-placeholder"></div>
          </div>

          <div className="podium-container">
            {/* Rank 2 (Left) */}
            <div className="podium-spot second">
              {sortedCandidates.length > 1 ? (
                <>
                  <div className="avatar-circle white-circle" style={{ backgroundImage: `url(${sortedCandidates[1].image})`, backgroundSize: 'cover' }}>
                    {!sortedCandidates[1].image && sortedCandidates[1].name[0]}
                  </div>
                  <div className="podium-base">
                    <span className="rank-num">2</span>
                    <div className="vote-badge-small">{sortedCandidates[1].votes} Votes</div>
                  </div>
                  <span className="podium-name">{sortedCandidates[1].name}</span>
                </>
              ) : <div className="empty-spot"></div>}
            </div>

            {/* Rank 1 (Center - Highest) */}
            <div className="podium-spot first">
              {sortedCandidates.length > 0 ? (
                <>
                  <div className="icon-crown">👑</div>
                  <div className="avatar-circle yellow-circle" style={{ backgroundImage: `url(${sortedCandidates[0].image})`, backgroundSize: 'cover' }}>
                    {!sortedCandidates[0].image && sortedCandidates[0].name[0]}
                  </div>
                  <div className="podium-base">
                    <span className="rank-num">1</span>
                    <div className="vote-badge-small">{sortedCandidates[0].votes} Votes</div>
                  </div>
                  <span className="podium-name big">{sortedCandidates[0].name}</span>
                </>
              ) : <div className="empty-spot"></div>}
            </div>

            {/* Rank 3 (Right) */}
            <div className="podium-spot third">
              {sortedCandidates.length > 2 ? (
                <>
                  <div className="avatar-circle orange-circle" style={{ backgroundImage: `url(${sortedCandidates[2].image})`, backgroundSize: 'cover' }}>
                    {!sortedCandidates[2].image && sortedCandidates[2].name[0]}
                  </div>
                  <div className="podium-base">
                    <span className="rank-num">3</span>
                    <div className="vote-badge-small">{sortedCandidates[2].votes} Votes</div>
                  </div>
                  <span className="podium-name">{sortedCandidates[2].name}</span>
                </>
              ) : <div className="empty-spot"></div>}
            </div>
          </div>
        </section>

        {/* Candidates Selection */}
        <section className="peserta-section">
          <h2 className="section-title">Select Candidate to Vote</h2>
          
          <div className="event-grid">
            {event.candidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className={`event-card ${selectedCandidateId === candidate.id ? 'selected-card' : ''}`}
                onClick={() => setSelectedCandidateId(candidate.id)}
                style={{ cursor: 'pointer', border: selectedCandidateId === candidate.id ? '3px solid #E85D04' : '1px solid #eee' }}
              >
                <div className="card-image" style={{
                  backgroundImage: candidate.image ? `url(${candidate.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {selectedCandidateId === candidate.id && (
                    <div className="selected-badge">
                      <CheckCircle size={24} color="white" fill="#E85D04" />
                    </div>
                  )}
                </div>
                <div className="card-details">
                  <h3 className="card-title">{candidate.name}</h3>
                  <div className="card-footer">
                     <button 
                        className={`secondary-btn ${selectedCandidateId === candidate.id ? 'active' : ''}`} 
                        style={{width: '100%', marginTop: '10px'}}
                     >
                        {selectedCandidateId === candidate.id ? 'Selected' : 'Vote This'}
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