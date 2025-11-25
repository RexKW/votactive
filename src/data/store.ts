// Types
export interface Candidate {
  id: string; // UUID for easier management
  name: string;
  image: string; // Base64 string
  votes: number;
  voters: string[]; // Array of usernames who voted for this candidate
}

export interface VotingEvent {
  id: number;
  title: string;
  date: string;
  price: string;
  priceValue: number;
  location: string;
  description: string;
  image: string; // Event Banner (Base64)
  candidates: Candidate[];
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
    image: '', // Empty string means use default placeholder
    candidates: [
      { id: 'c1', name: 'Candidate A', image: '', votes: 50, voters: ['user1', 'user2'] },
      { id: 'c2', name: 'Candidate B', image: '', votes: 100, voters: ['user3', 'admin'] },
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
    image: '',
    candidates: []
  },
];

// Storage Keys
const STORAGE_KEY = 'votactive_events';
const USER_KEY = 'votactive_user';

// Helpers
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

// Voting Logic
export const voteForCandidate = (eventId: number, candidateId: string, username: string) => {
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) return false;

  const candidateIndex = events[eventIndex].candidates.findIndex(c => c.id === candidateId);
  
  if (candidateIndex === -1) return false;

  // Check if user already voted in this event (optional rule, good for voting apps)
  const hasVoted = events[eventIndex].candidates.some(c => c.voters.includes(username));
  if (hasVoted) {
    alert("You have already voted in this event!");
    return false;
  }

  // Add vote
  events[eventIndex].candidates[candidateIndex].votes += 1;
  events[eventIndex].candidates[candidateIndex].voters.push(username);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  return true;
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