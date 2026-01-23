
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { getEvents, deleteEvent } from '../data/store';
// import { getEvents, deleteEvent as apiDeleteEvent } from '../apis/EventCRUD';
import type { VotingEvent } from '../data/store';
import { Plus, Edit, Trash, BarChart, User, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';
import type { EventResponse, EventWithCandidatesResponse } from '../models/event-model';
import { getCandidates } from '../apis/CandidateCRUD';

export default function EventOrganizerDashboard() {
  // const [events, setEvents] = useState<VotingEvent[]>([]);
  const [events, setEvents] = useState<EventWithCandidatesResponse[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const token = localStorage.getItem('token');

  // useEffect(() => {
  //   if(token){
  //     fetchEvents(token)
  //   }
  // }, [token]);

  // const fetchEvents = async (token: string) => {
  //   const fetchedEvents = await getEvents(token);
  //   const eventsWithCandidates = await Promise.all(
  //     fetchedEvents.data.map(async (event: EventResponse) => {
  //       const candidatesResponse = await getCandidates(event.id);
  //       return { ...event, candidates: candidatesResponse.data };
  //     })
  //   );

  //   setEvents(eventsWithCandidates);
  // };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this event?')) return;
    // await apiDeleteEvent(id, token);
    // await fetchEvents(token);
  };

  const toggleStats = (id: number) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="main-content">
        <div className="admin-header">
          <h1 className="section-title">Organizer Dashboard</h1>
          <Link to="/admin/create" className="primary-btn icon-btn">
            <Plus size={20} /> Create New Event
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Total Votes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const totalEventVotes = event.candidates.reduce((acc, curr) => acc + curr.totalVotes ? curr.totalVotes : 0, 0);
                const isExpanded = expandedEventId === event.id;

                return (
                  <>
                    <tr key={event.id}>
                      <td>#{event.id}</td>
                      <td>{event.name}</td>
                      <td>{new Date(event.startDate).toLocaleDateString()}</td>
                      <td>
                        <div className="vote-count">
                          <BarChart size={16} /> {totalEventVotes}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => toggleStats(event.id)} 
                            className="secondary-btn icon-btn"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} Stats
                          </button>
                          <Link to={`/admin/edit/${event.id}`} className="icon-btn edit">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(event.id)} className="icon-btn delete">
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="stats-row">
                        <td colSpan={5}>
                          <div className="stats-container">
                            <h4>Voting Statistics: {event.name}</h4>
                            <div className="candidates-stats">
                              {event.candidates.map(cand => (
                                <div key={cand.id} className="cand-stat-card">
                                  <div className="cand-header">
                                    <strong>{cand.name}</strong>
                                    <span className="vote-badge">{cand.totalVotes} Votes</span>
                                  </div>
                                  <div className="voter-list">
                                    <small>Voters:</small>
                                    <ul>
                                      {cand.votes!.length > 0 ? (
                                        cand.votes!.map((voter, idx) => (
                                          <li key={idx}><User size={12}/> {voter.voterId}</li>
                                        ))
                                      ) : (
                                        <li className="no-votes">No votes yet</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}