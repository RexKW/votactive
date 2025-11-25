import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveEvent, getEventById } from '../data/store';
import type { VotingEvent } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<VotingEvent>>({
    title: '',
    date: '',
    price: '',
    location: '',
    description: '',
    votes: 0,
    candidates: []
  });

  useEffect(() => {
    if (id) {
      const event = getEventById(Number(id));
      if (event) setFormData(event);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = id ? Number(id) : Date.now(); // Simple ID generation
    saveEvent({
      ...formData as VotingEvent,
      id: newId
    });
    navigate('/admin');
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="main-content">
        <div className="form-container">
          <h2 className="section-title">{id ? 'Edit Event' : 'Create Event'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Event Title</label>
              <input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price Display (e.g. Rp 20.000)</label>
                <input 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={4}
                required 
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/admin')} className="secondary-btn">Cancel</button>
              <button type="submit" className="primary-btn">Save Event</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}