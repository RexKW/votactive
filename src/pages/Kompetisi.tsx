import { Search, Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Kompetisi() {
  // Data for the 6 cards shown in the design
  const events = Array(6).fill({
    title: 'Diesnatalis',
    date: '27 November 2025',
    price: 'Rp 20.000,00',
    location: 'Offline'
  });

  return (
    <div className="votactive-container kompetisi-page">
      {/* Header */}
      <header className="votactive-header">
        <div className="votactive-header-content">
          <div className="votactive-logo">
            <span className="logo-box orange">vot</span>
            <span className="logo-text white">active</span>
          </div>
          <nav className="votactive-nav">
            <Link to="/">Beranda</Link>
            <Link to="/kompetisi" className="active">Kompetisi</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="kompetisi-main">
        {/* Diagonal Blue Background Layer */}
        <div className="kompetisi-bg-layer"></div>

        <div className="kompetisi-content-wrapper">
          {/* Explore Header */}
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

          {/* Event Grid */}
          <section className="kompetisi-grid-section">
            <div className="event-grid">
              {events.map((event, index) => (
                <Link to="/detail-kompetisi" key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="event-card">
                    <div className="card-image">
                      {/* Placeholder for yellow image */}
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
                          <span className="location-icon">
                            {/* Custom offline icon representation */}
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

      {/* Footer */}
      <footer className="votactive-footer">
        <div className="footer-content">
           <div className="footer-boxes-vertical">
              <div className="footer-placeholder-vertical"></div>
              <div className="footer-placeholder-vertical"></div>
              <div className="footer-placeholder-vertical"></div>
           </div>
           
           <div className="footer-bottom">
              <div className="votactive-logo">
                <span className="logo-box orange">vot</span>
                <span className="logo-text white">active</span>
              </div>
              <div className="footer-bar"></div>
           </div>
        </div>
      </footer>
    </div>
  );
}