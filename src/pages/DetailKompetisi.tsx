import { Search, Calendar, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function DetailKompetisi() {
  // Mock data for participants
  const participants = Array(6).fill({
    title: 'Diesnatalis',
    date: '27 November 2025',
    price: 'Rp 20.000,00'
  });

  return (
    <div className="votactive-container detail-page">
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

      <main className="detail-main">
        {/* Section 1: Event Info */}
        <section className="event-info-section">
          <div className="event-info-wrapper">
            <div className="event-banner-placeholder"></div>
            
            <div className="event-text-content">
              <h1 className="event-detail-title">Masukkan Judul Event</h1>
              <div className="event-meta">
                <Calendar size={16} />
                <span>27 November 2025</span>
              </div>
              
              <div className="event-tags">
                <div className="tag-item orange-text">
                  <WifiOff size={20} />
                  <span>Offline</span>
                </div>
                <div className="tag-placeholder"></div>
              </div>

              <p className="event-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              
              {/* Floating Action Button */}
              <button className="fab-button"></button>
            </div>
          </div>

          {/* Grey Bar Placeholder */}
          <div className="wide-grey-bar"></div>
        </section>

        {/* Section 2: Leaderboard */}
        <section className="leaderboard-section">
          <div className="leaderboard-header">
             <div className="header-box-placeholder"></div>
             <h2 className="leaderboard-title">LEADERBOARD</h2>
             <div className="header-box-placeholder"></div>
          </div>

          <div className="podium-container">
            {/* 2nd Place */}
            <div className="podium-spot second">
              <div className="avatar-circle white-circle"></div>
              <div className="podium-base"></div>
            </div>
            {/* 1st Place */}
            <div className="podium-spot first">
              <div className="avatar-circle yellow-circle"></div>
              <div className="podium-base"></div>
            </div>
            {/* 3rd Place */}
            <div className="podium-spot third">
              <div className="avatar-circle orange-circle"></div>
              <div className="podium-base"></div>
            </div>
          </div>
        </section>

        {/* Section 3: Peserta */}
        <section className="peserta-section">
          <h2 className="section-title">Peserta</h2>
          
          <div className="peserta-search-bar">
             <Search className="search-icon" size={18} />
             <input type="text" placeholder="Carikan Peserta Disini..." />
          </div>

          <div className="event-grid">
            {participants.map((item, index) => (
              <div key={index} className="event-card">
                <div className="card-image"></div>
                <div className="card-details">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="card-info-row">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </div>
                  <div className="card-footer">
                     <span className="price-label">Mulai dari</span>
                     <div className="price-row">
                       <span className="price-value">{item.price}</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-bar-right"></div>
        </section>
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