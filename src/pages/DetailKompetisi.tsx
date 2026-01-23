import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Calendar, WifiOff, CheckCircle, DivideSquare } from 'lucide-react';
import { getCurrentUser } from '../data/store';
import { getEventById } from '../apis/EventCRUD';
import type { VotingEvent } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';
import type { EventResponse } from '../models/event-model';
import { getCandidates } from '../apis/CandidateCRUD';
import type { CandidateResponse } from '../models/candidate-model';

export default function DetailKompetisi() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [event, setEvent] = useState<VotingEvent | undefined>(undefined);
  const [event, setEvent] = useState<EventResponse>()
  const [candidates, setCandidates] = useState<CandidateResponse[]>([])
  const [popUpState, setPopUpState] = useState<boolean>(false)
  const [candidateName, setCandidateName] = useState<string>()
  const [voteAmount, setVoteAmount] = useState<number>(0)
    const [candidateImage, setCandidateImage] = useState<string>()

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // const found = getEventById(Number(id));
      // setEvent(found);
      getEvent(id)
      fetchedCandidates(id)
    }
  }, [id]);

  const handleSelect = (name: string, id: string) =>{
    setCandidateName(name)
    setSelectedCandidateId(id)

    setPopUpState(true)
  }

  const handleAcceptVote = () =>{
    //payment gateway goes in here aswell
    
  }

  const handleClose =() =>{
    setCandidateName("")
    setPopUpState(false)
  }

  const getEvent = async(id: string) => {
    const fetchedEvent = await getEventById(id)
    console.log("Raw fetched data:", fetchedEvent);
    setEvent(fetchedEvent.data)
  }


  const fetchedCandidates = async(id:string) =>{
    const fetchedCandidates = await getCandidates(id)
    console.log("Raw fetched candidates data:", fetchedCandidates);
    setCandidates(fetchedCandidates.data)
  }

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
  const sortedCandidates = [...candidates].sort((a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0));

  // We need at least 1 candidate to show a podium.
  // The layout is tricky: Center is 1st (index 0), Left is 2nd (index 1), Right is 3rd (index 2)
  
  return (
    <div className="votactive-container detail-page">
      <Header />
      { popUpState &&
        <div className='w-screen h-screen fixed flex justify-center items-center bg-black/25 z-100'>
          <div className='bg-white rounded-xl pb-5 pt-10 w-128 px-5 flex flex-col justify-center items-center relative'>
              <button onClick={handleClose} className='absolute top-2 left-2'>x</button>
              <div className="card-image w-full h-full rounded-xl" style={{
                  backgroundImage: candidateImage ? `url(${candidateImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>

                </div>
              <p className='mt-5 text-3xl font-bold'>{candidateName}</p>
              <div className='border-[#eee] border-1 w-full mt-5 flex flex-col'>
                <input type="number" value={voteAmount} onChange={(e) => setVoteAmount(e.target.valueAsNumber)} />
              </div>

          </div>
        </div>
      }

      <main className="detail-main">
        {/* Event Info */}
        <section className="event-info-section">
          <div className="event-info-wrapper">
            <div className="event-banner-placeholder" style={{
              backgroundImage: event.coverImage ? `url(${event.coverImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: event.coverImage ? 'transparent' : '#FCD34D'
            }}></div>
            
            <div className="event-text-content">
              <h1 className="event-detail-title">{event.name}</h1>
              <div className="event-meta">
                <Calendar size={16} />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              
              <div className="event-tags">
                <div className="tag-item orange-text">
                  <WifiOff size={20} />
                  <span>Offline</span>
                </div>
              </div>

              <p className="event-description">{event.details}</p>
              
              <button onClick={handleVote} className="primary-btn px5 py-2">
                VOTE NOW
              </button>
              <div className='mt-5'>
                {event.description}
              </div>
            </div>
            
          </div>
          
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
                    {!sortedCandidates[1].image}
                  </div>
                  <div className="podium-base">
                    <span className="rank-num">2</span>
                    <div className="vote-badge-small">{sortedCandidates[1].totalVotes} Votes</div>
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
                    {!sortedCandidates[0].image}
                  </div>
                  <div className="podium-base">
                    <span className="rank-num">1</span>
                    <div className="vote-badge-small">{sortedCandidates[0].totalVotes} Votes</div>
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
                    {!sortedCandidates[2].image}
                  </div>
                  <div className="podium-base">
                    <span className="rank-num">3</span>
                    <div className="vote-badge-small">{sortedCandidates[2].totalVotes} Votes</div>
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
            {candidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className={`event-card ${selectedCandidateId === candidate.id ? 'selected-card' : ''}`}
                onClick={() => handleSelect(candidate.name, candidate.id)}
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