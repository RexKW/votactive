import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEvents } from '../data/store';
import type { VotingEvent } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function Home() {
  const [events, setEvents] = useState<VotingEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  return (
    <div className="votactive-container">
      <Header />

      {/* Hero Section */}
      <section className="votactive-hero">
        <div className="votactive-hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="orange">vot</span>
              <span className="white">active</span>
            </h1>
            <p className="hero-slogan">Vote Pemilihan umum dan kegiatan lainnya</p>
            
            <div className="hero-search">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Cari Event Disini..." />
            </div>
          </div>

          <div className="hero-right">
             <div className="illustration-placeholder">
                <div className="ballot-box">
                  <div className="slot"></div>
                </div>
                <div className="hand-holding-card">
                  <div className="card-vote">vot<span>active</span></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <main className="main-content">
        <section className="content-section">
          <h2 className="section-title">Event Populer</h2>
          <div className="event-grid">
            {events.map((event) => (
              <Link 
                to={`/detail-kompetisi/${event.id}`} 
                key={event.id} 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%' 
                }}
              >
                <div className="event-card">
                  <div 
                    className="card-image"
                    style={{
                      backgroundImage: event.image ? `url(${event.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: event.image ? 'transparent' : '#FFD633'
                    }}
                  >
                    <span className="badge-icon">🔥</span>
                  </div>
                  <div className="card-details">
                    <h3 className="card-title">{event.title}</h3>
                    <div className="card-info-row">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>
                    <div className="card-footer">
                       <span className="price-label">Mulai dari</span>
                       <div className="price-row">
                         <span className="price-value">{event.price}</span>
                         <span className="location-icon"><Ticket size={16} /></span>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}