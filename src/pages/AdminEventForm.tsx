import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, saveEvent, type VotingEvent, type Candidate } from '../data/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash, Plus, Upload, X } from 'lucide-react';
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
    image: '',
    votes: 0,
    candidates: []
  });

  useEffect(() => {
    if (id) {
      const event = getEventById(Number(id));
      if (event) setFormData(event);
    }
  }, [id]);

  // --- NEW: Image Compression Helper ---
  // Resizes images to max 500px and compresses quality to 70%
  // This prevents the "QuotaExceededError" in LocalStorage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions (e.g., 500px width/height)
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the resized image onto the canvas
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to Base64 with compression (JPEG at 70% quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          callback(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Candidate Management ---
  const addCandidate = () => {
    const newCandidate: Candidate = {
      // Safe ID generation
      id: 'cand_' + Date.now() + '_' + Math.floor(Math.random() * 1000), 
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

    // Prepare object for saving
    const eventToSave: VotingEvent = {
        id: newId,
        title: formData.title || '',
        date: formData.date || '',
        price: formData.price || '',
        priceValue: formData.priceValue || 0,
        location: formData.location || '',
        description: formData.description || '',
        image: formData.image || '',
        votes: formData.votes || 0,
        candidates: formData.candidates
    };

    try {
      saveEvent(eventToSave);
      navigate('/admin');
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event. Your image might still be too large, or LocalStorage is full.");
    }
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