import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, saveEvent, type VotingEvent, type Candidate } from '../data/store';
import type { VotingEvent as VotingEventType } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash, Plus, Upload, X } from 'lucide-react';
import '../App.css';

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<VotingEventType>>({
    title: '',
    date: '',
    price: '',
    location: '',
    description: '',
    image: '',
    candidates: []
  });

  useEffect(() => {
    if (id) {
      const event = getEventById(Number(id));
      if (event) setFormData(event);
    }
  }, [id]);

  // Helper to convert file to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Candidate Management
  const addCandidate = () => {
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: '',
      image: '',
      votes: 0,
      voters: []
    };
    setFormData(prev => ({
      ...prev,
      candidates: [...(prev.candidates || []), newCandidate]
    }));
  };

  const updateCandidate = (index: number, field: keyof Candidate, value: any) => {
    const updatedCandidates = [...(formData.candidates || [])];
    updatedCandidates[index] = { ...updatedCandidates[index], [field]: value };
    setFormData({ ...formData, candidates: updatedCandidates });
  };

  const removeCandidate = (index: number) => {
    const updatedCandidates = [...(formData.candidates || [])];
    updatedCandidates.splice(index, 1);
    setFormData({ ...formData, candidates: updatedCandidates });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = id ? Number(id) : Date.now();
    
    // Validation: Ensure candidates array exists and has at least 2 items
    if(!formData.candidates || formData.candidates.length < 2) {
      alert("Please add at least 2 candidates.");
      return;
    }

    // Ensure all required fields are present before saving
    const eventToSave: VotingEvent = {
        id: newId,
        title: formData.title || '',
        date: formData.date || '',
        price: formData.price || '',
        priceValue: formData.priceValue || 0, // Ensure priceValue is handled if needed, or default to 0
        location: formData.location || '',
        description: formData.description || '',
        image: formData.image || '',
        candidates: formData.candidates
    };

    saveEvent(eventToSave);
    navigate('/admin');
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="main-content">
        <div className="form-container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title">{id ? 'Edit Event' : 'Create Event'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            
            {/* --- Event Details --- */}
            <div className="form-group">
              <label>Event Title</label>
              <input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label>Event Image (Banner)</label>
              <div className="image-upload-box">
                {formData.image ? (
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                    <button type="button" onClick={() => setFormData({...formData, image: ''})} className="remove-img-btn">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <Upload size={24} />
                    <span>Click to upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (base64) => setFormData({...formData, image: base64}))} hidden />
                  </label>
                )}
              </div>
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
                <label>Price Display</label>
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

            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

            {/* --- Candidates Section --- */}
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>Candidates Management</h3>
            
            <div className="candidates-list">
              {formData.candidates?.map((candidate, index) => (
                <div key={candidate.id} className="candidate-form-item">
                  <div className="candidate-img-input">
                    {candidate.image ? (
                      <div className="mini-preview">
                        <img src={candidate.image} alt="Cand" />
                        <button type="button" onClick={() => updateCandidate(index, 'image', '')}><X size={12}/></button>
                      </div>
                    ) : (
                      <label className="mini-upload">
                        <Upload size={16} />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (base64) => updateCandidate(index, 'image', base64))} hidden />
                      </label>
                    )}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Candidate Name" 
                    value={candidate.name} 
                    onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => removeCandidate(index)} className="icon-btn delete">
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addCandidate} className="secondary-btn full-width" style={{ marginTop: '10px' }}>
              <Plus size={16} /> Add Candidate
            </button>

            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

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