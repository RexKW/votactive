import { useState, useEffect } from 'react';
import { Search, Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { VotingEvent } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';
import { getEvents } from '../apis/EventCRUD';
import type { EventResponse } from '../models/event-model';

export default function Kompetisi() {
  const [events, setEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    fetchEvents()
  }, []);

  const fetchEvents = async () =>{
    const fetchedEvents = await getEvents()
    setEvents(fetchedEvents);
  }

  return (
    <div className="votactive-container kompetisi-page">
      <Header />

      <main className="kompetisi-main">
        <div className="kompetisi-bg-layer"></div>

        <div className="kompetisi-content-wrapper">
          <section className="explore-header">
            <h1 className="explore-title">Explore</h1>
            <div className="explore-search">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Masukkan Event Disini..." />
            </div>
            <div className="filter-chips">
              <button className="chip"></button>
              <button className="chip"></button>
              <button className="chip"></button>
              <button className="chip"></button>
            </div>
          </section>

          <section className="kompetisi-grid-section">
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
                        backgroundImage: event.coverImage ? `url(${event.coverImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: event.coverImage ? 'transparent' : '#FFD633'
                      }}
                    >
                      {/* Placeholder or badge if needed */}
                    </div>
                    <div className="card-details">
                      <h3 className="card-title">{event.name}</h3>
                      <div className="card-info-row">
                        <Calendar size={14} />
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="card-footer">
                        <span className="price-label">Mulai dari</span>
                        <div className="price-row">
                          <span className="price-value">{event.price}</span>
                          <span className="location-icon">
                            <Ticket size={16} className="strikethrough-icon" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}