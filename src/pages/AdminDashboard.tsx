import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../data/store';
import type { VotingEvent } from '../data/store';
import { Plus, Edit, Trash, BarChart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

export default function AdminDashboard() {
  const [events, setEvents] = useState<VotingEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      setEvents(getEvents()); // Refresh list
    }
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
                <th>Votes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>#{event.id}</td>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>
                    <div className="vote-count">
                      <BarChart size={16} /> {event.votes}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/edit/${event.id}`} className="icon-btn edit">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="icon-btn delete">
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}