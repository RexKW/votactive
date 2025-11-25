import { Search, MapPin, Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Home() {
  const popularEvents = [
    { id: 1, title: 'Diesnatalis', date: '21 November 2023', price: 'Rp 20.000,00', location: 'Gedung Serbaguna', imageColor: '#FCD34D' },
    { id: 2, title: 'Music Fest', date: '25 November 2023', price: 'Rp 50.000,00', location: 'Lapangan Utama', imageColor: '#FCD34D' },
    { id: 3, title: 'Art Gallery', date: '01 Desember 2023', price: 'Free', location: 'Aula Kampus', imageColor: '#FCD34D' },
  ];

  return (
    <div className="votactive-container">
      {/* Header */}
      <header className="votactive-header">
        <div className="votactive-header-content">
          <div className="votactive-logo">
            <span className="logo-box orange">vot</span>
            <span className="logo-text white">active</span>
          </div>
          <nav className="votactive-nav">
            <Link to="/" className="active">Beranda</Link>
            <Link to="/kompetisi">Kompetisi</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="votactive-hero">
        <div className="votactive-hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="orange">vot</span>
              <span className="white">active</span>
            </h1>
            <p className="hero-slogan">Masukkan Slogan disini</p>
            
            <div className="hero-search">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Cari Event Disini..." />
            </div>
          </div>

          {/* Illustration Placeholder (Right Side) */}
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

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Event Populer */}
        <section className="content-section">
          <h2 className="section-title">Event Populer</h2>
          <div className="event-grid">
            {popularEvents.map((event) => (
              /* Wrap card in Link */
              <Link to="/detail-kompetisi" key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="event-card">
                  <div className="card-image">
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

        {/* Event Terbaru */}
        <section className="content-section">
          <h2 className="section-title">Event Terbaru</h2>
          <div className="event-grid">
            {popularEvents.map((event) => (
              /* Wrap card in Link */
              <Link to="/detail-kompetisi" key={`new-${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="event-card">
                  <div className="card-image"></div>
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
                         <span className="location-icon"><MapPin size={16} /></span>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="votactive-footer">
        <div className="footer-content">
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