// Types
export interface VotingEvent {
  id: number;
  title: string;
  date: string;
  price: string;
  priceValue: number; // Numeric value for logic
  location: string;
  description: string;
  votes: number; // For admin stats
  candidates: { name: string; votes: number; color: string }[];
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}

// Initial Mock Data
const initialEvents: VotingEvent[] = [
  {
    id: 1,
    title: 'Diesnatalis',
    date: '21 November 2023',
    price: 'Rp 20.000,00',
    priceValue: 20000,
    location: 'Gedung Serbaguna',
    description: 'Annual university anniversary celebration featuring guest stars and student performances.',
    votes: 150,
    candidates: [
      { name: 'Candidate A', votes: 50, color: '#FCD34D' },
      { name: 'Candidate B', votes: 100, color: '#E85D04' },
    ]
  },
  {
    id: 2,
    title: 'Music Fest',
    date: '25 November 2023',
    price: 'Rp 50.000,00',
    priceValue: 50000,
    location: 'Lapangan Utama',
    description: 'The biggest music festival in town.',
    votes: 320,
    candidates: []
  },
  {
    id: 3,
    title: 'Art Gallery',
    date: '01 Desember 2023',
    price: 'Free',
    priceValue: 0,
    location: 'Aula Kampus',
    description: 'Exhibition of student art projects.',
    votes: 45,
    candidates: []
  },
];

// Helper to simulate database
const STORAGE_KEY = 'votactive_events';
const USER_KEY = 'votactive_user';

export const getEvents = (): VotingEvent[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  }
  return JSON.parse(stored);
};

export const getEventById = (id: number): VotingEvent | undefined => {
  const events = getEvents();
  return events.find(e => e.id === id);
};

export const saveEvent = (event: VotingEvent) => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  if (index >= 0) {
    events[index] = event;
  } else {
    events.push(event);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const deleteEvent = (id: number) => {
  const events = getEvents().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

// Auth Simulation
export const login = (username: string, role: 'admin' | 'user') => {
  localStorage.setItem(USER_KEY, JSON.stringify({ username, role }));
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};