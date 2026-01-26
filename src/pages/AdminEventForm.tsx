import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash, Plus, Upload, X } from 'lucide-react';
import '../App.css';
import type { EventFormData, EventResponse } from '../models/event-model';
import { getEventById, createEvent, updateEvent } from '../apis/EventCRUD';
import { addCandidate, updateCandidate, getCandidates } from '../apis/CandidateCRUD'; 
//
import { db, storage } from '../FirebaseConf'; 
// Import Storage functions
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc } from 'firebase/firestore/lite';
import type { Candidate } from '../data/store';

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  interface ExtendedEventFormData extends EventFormData {
    candidates: Candidate[];
  }
  
  const [formData, setFormData] = useState<ExtendedEventFormData>({
    name: '',
    coverImage: '',
    location: '',
    description: '',
    price: 0,
    details: '',
    startDate: '',
    endDate: '',
    candidates: [] 
  } as any);

  useEffect(() => {
    if (id) {
      getEvent(id)
    }
  }, [id]);

  const toFormData = (event: EventResponse): EventFormData => ({
    name: event.name,
    coverImage: event.coverImage,
    location: event.location,
    description: event.description,
    price: event.price,
    details: event.details,
    startDate: event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : '',
  });

  const getEvent = async(id: string) => {
    try {
        const fetchedEvent = await getEventById(id);
        const baseData = toFormData(fetchedEvent.data);
        const candidatesRes = await getCandidates(id);
        const candidatesData = candidatesRes.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            image: c.image,
            votes: c.totalVotes || c.votes || 0,
            voters: []
        }));
        setFormData({ ...baseData, candidates: candidatesData });
    } catch (e) {
        console.error("Error loading event data:", e);
    }
  }

  // --- Image Compression Helper ---
  // Keeps the image as Base64 in state for "Preview" purposes only
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

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
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          callback(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // --- NEW: Storage Upload Function ---
  // Takes the Base64, uploads to Firebase Storage, returns the Download URL
  const uploadImageToStorage = async (base64String: string, path: string): Promise<string> => {
    // If it's already an HTTP URL (from a previous save), don't re-upload
    if (!base64String || base64String.startsWith('http')) {
      return base64String;
    }

    // Only upload if it is a fresh Data URL (Base64)
    if (base64String.startsWith('data:image')) {
      try {
        const storageRef = ref(storage, path);
        // 'uploadString' automatically parses the Base64 data url
        await uploadString(storageRef, base64String, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error(`Failed to upload image to ${path}`, error);
        throw error;
      }
    }
    return base64String;
  };

  // --- Candidate Management ---
  const addCandidateLocally = () => {
    const newCandidate: Candidate = {
      id: 'temp_' + Date.now(), 
      name: '',
      image: '',
      votes: 0,
      voters: []
    };
    setFormData((prev: any) => ({
      ...(prev ?? {}),
      candidates: [...((prev?.candidates) || []), newCandidate]
    }));
  };

  const updateCandidateLocal = (index: number, field: keyof Candidate, value: any) => {
    const current = formData ?? {} as any;
    const updatedCandidates = [...(current.candidates || [])];
    updatedCandidates[index] = { ...updatedCandidates[index], [field]: value };
    setFormData({ ...(current as any), candidates: updatedCandidates });
  };

  const removeCandidateLocal = (index: number) => {
    const current = formData ?? {} as any;
    const updatedCandidates = [...(current.candidates || [])];
    updatedCandidates.splice(index, 1);
    setFormData({ ...(current as any), candidates: updatedCandidates });
  };

  // --- Updated Submit Logic ---
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const candidates = (formData as any)?.candidates || [];
    if(candidates.length < 2) {
      alert("Please add at least 2 candidates.");
      return;
    }

    try {
        // 1. Upload Event Cover Image First (if it changed)
        // We use a timestamp to ensure unique filenames
        const eventImageName = `events/${Date.now()}_cover_img`;
        const uploadedCoverUrl = await uploadImageToStorage(formData.coverImage || '', eventImageName);

        // 2. Prepare Event Payload with the NEW URL
        const eventToSave = {
            name: formData?.name ?? '',
            coverImage: uploadedCoverUrl, // Save the URL, NOT the Base64
            location: formData?.location ?? '',
            description: (formData as any)?.description ?? '',
            details: (formData as any)?.details ?? (formData as any)?.description ?? '',
            price: Number(formData?.price ?? 0),
            startDate: new Date(formData?.startDate), 
            endDate: new Date(formData?.endDate),     
        };

        let eventDocId = id;

        // 3. Save Event to Firestore
        if (eventDocId) {
          await updateEvent(eventDocId, eventToSave);
        } else {
          const res = await createEvent(eventToSave);
          eventDocId = res.id;
        }

        if (!eventDocId) throw new Error("Failed to get Event ID");
        const eventRef = doc(db, "events", eventDocId);

        // 4. Upload & Save Candidates
        for (const cand of candidates) {
            if (!cand.name.trim()) continue;

            // Upload Candidate Image
            const candImageName = `candidates/${eventDocId}/${cand.id}_${Date.now()}`;
            const uploadedCandUrl = await uploadImageToStorage(cand.image || '', candImageName);

            const candidatePayload = {
                name: cand.name,
                image: uploadedCandUrl, // Save the URL
                totalVotes: cand.votes || 0,
                eventId: eventRef 
            };

            if (cand.id && String(cand.id).startsWith('temp_')) {
                await addCandidate(candidatePayload);
            } else if (cand.id) {
                await updateCandidate(cand.id, candidatePayload);
            }
        }

        alert("Event and candidates saved successfully!");
        navigate('/admin/dashboard');

    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event. Check console.");
    }
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="main-content">
        <div className="form-container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title">{id ? 'Edit Event' : 'Create Event'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            
            {/* Event Title */}
            <div className="form-group">
              <label>Event Title</label>
              <input 
                value={formData?.name ?? ''} 
                onChange={e => setFormData({...(formData ?? {}), name: e.target.value} as any)}
                required 
              />
            </div>

            {/* Event Image Input */}
            <div className="form-group">
              <label>Event Image (Banner)</label>
              <div className="image-upload-box">
                {formData?.coverImage ? (
                  <div className="image-preview">
                    {/* The src will be either Base64 (fresh upload) or http URL (existing) */}
                    <img src={formData.coverImage} alt="Preview" />
                    <button type="button" onClick={() => setFormData({...formData, coverImage: ''} as any)} className="remove-img-btn">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <Upload size={24} />
                    <span>Click to upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (base64) => setFormData({... (formData ?? {}), coverImage: base64} as any))} hidden />
                  </label>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date Start</label>
                <input
                  type="date"
                  value={formData?.startDate ?? ''}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value } as any)}
                  required
                />
              </div>
               <div className="form-group">
                <label>Date End</label>
                <input
                  type="date"
                  value={formData?.endDate ?? ''}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value } as any)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (IDR)</label>
                <input
                  type="number"
                  value={formData?.price  ?? 0}
                  onChange={e =>
                    setFormData({ ...formData, price: Number(e.target.value) } as any)
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                value={formData?.location ?? ''} 
                onChange={e => setFormData({... (formData ?? {}), location: e.target.value} as any)}
                required 
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={(formData as any)?.description ?? ''} 
                onChange={e => setFormData({... (formData ?? {}), description: e.target.value} as any)}
                rows={4}
                required 
              />
            </div>

            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

            {/* Candidates Section */}
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>Candidates Management</h3>
            
            <div className="candidates-list">
              {((formData as any)?.candidates || []).map((candidate: Candidate, index: number) => (
                <div key={candidate.id} className="candidate-form-item">
                  <div className="candidate-img-input">
                    {candidate.image ? (
                      <div className="mini-preview">
                        <img src={candidate.image} alt="Cand" />
                        <button type="button" onClick={() => updateCandidateLocal(index, 'image', '')}><X size={12}/></button>
                      </div>
                    ) : (
                      <label className="mini-upload">
                        <Upload size={16} />
                        {/* Candidate Image Input */}
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (base64) => updateCandidateLocal(index, 'image', base64))} hidden />
                      </label>
                    )}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Candidate Name" 
                    value={candidate.name} 
                    onChange={(e) => updateCandidateLocal(index, 'name', e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => removeCandidateLocal(index)} className="icon-btn delete">
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addCandidateLocally} className="secondary-btn full-width" style={{ marginTop: '10px' }}>
              <Plus size={16} /> Add Candidate
            </button>

            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/admin/dashboard')} className="secondary-btn">Cancel</button>
              <button type="submit" className="primary-btn">Save Event</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}