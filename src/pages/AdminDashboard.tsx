import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../data/store';
import type { VotingEvent } from '../data/store';
import { Plus, Edit, Trash, BarChart, User, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function AdminDashboard() {
  const [events, setEvents] = useState<VotingEvent[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      setEvents(getEvents()); // Refresh list
    }
  };

  const toggleStats = (id: number) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <div className="votactive-container">
      <Header />
      <main className="main-content">
        <div className="admin-header">
          <h1 className="section-title">Admin Dashboard</h1>
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
                const totalVotes = event.candidates.reduce((acc, curr) => acc + curr.votes, 0);
                const isExpanded = expandedEventId === event.id;

                return (
                  <>
                    <tr key={event.id}>
                      <td>#{event.id}</td>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>
                        <div className="vote-count">
                          <BarChart size={16} /> {totalVotes}
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
                            <h4>Voting Statistics: {event.title}</h4>
                            <div className="candidates-stats">
                              {event.candidates.map(cand => (
                                <div key={cand.id} className="cand-stat-card">
                                  <div className="cand-header">
                                    <strong>{cand.name}</strong>
                                    <span className="vote-badge">{cand.votes} Votes</span>
                                  </div>
                                  <div className="voter-list">
                                    <small>Voters:</small>
                                    <ul>
                                      {cand.voters.length > 0 ? (
                                        cand.voters.map((voter, idx) => (
                                          <li key={idx}><User size={12}/> {voter}</li>
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