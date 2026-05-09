 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import SkeletonCard from '../../components/common/SkeletonCard';
import { useToast } from '../../components/common/Toast';
import { fetchEvents, deleteEvent } from '../../services/api';
import './ManageEventsPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const formatFee = (e) => e.isFree ? 'FREE' : `₹${e.fee}`;

function ManageEventsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [targetEvent, setTargetEvent] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents()
      .then(res => setEvents(res.data.events || []))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (event) => {
    setTargetEvent(event);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(targetEvent._id);
      setEvents(prev => prev.filter(e => e._id !== targetEvent._id));
      setDeleteModal(false);
      toast.success(`"${targetEvent.title}" deleted.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="manage-events-page">
      <Navbar />
      <PageWrapper>
        <div className="me2__header">
          <div>
            <h1 className="me2__title">Manage Events</h1>
            <p className="me2__sub">{events.length} total events</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="me2__search">
              <span>🔍</span>
              <input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button icon="+" onClick={() => navigate('/admin/events/create')}>New Event</Button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[1,2,3,4].map(i => <SkeletonCard key={i} type="tablerow" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState type="no-search" onAction={() => setSearch('')} />
        ) : (
          <div className="me2__table-wrap">
            <table className="me2__table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Type</th>
                  <th>Fee</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(event => {
                  const fill = Math.round((event.registeredCount / event.capacity) * 100);
                  return (
                    <tr key={event._id} className="me2__row">
                      <td>
                        <div className="me2__event-cell">
                          {event.image
                            ? <img src={event.image} alt="" className="me2__thumb" />
                            : <div className="me2__thumb" style={{ background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, borderRadius: 8 }}>🎪</div>
                          }
                          <div>
                            <div className="me2__event-name">{event.title}</div>
                            <div className="me2__event-org">{event.organizer}</div>
                          </div>
                        </div>
                      </td>
                      <td className="me2__cell">
                        <div>{formatDate(event.date)}</div>
                        <div style={{ color: '#9CA3AF', fontSize: 11 }}>{event.time}</div>
                      </td>
                      <td className="me2__cell">{event.venue}</td>
                      <td><Badge color={event.type === 'college' ? 'blue' : 'purple'} size="sm">{event.type}</Badge></td>
                      <td><Badge color={event.isFree ? 'green' : 'amber'} size="sm">{formatFee(event)}</Badge></td>
                      <td>
                        <div className="me2__seats">
                          <span>{event.registeredCount}/{event.capacity}</span>
                          <div className="me2__bar">
                            <div className="me2__fill" style={{ width: `${fill}%`, background: fill >= 90 ? '#EF4444' : fill >= 70 ? '#F59E0B' : '#10B981' }} />
                          </div>
                        </div>
                      </td>
                      <td><Badge size="sm" color={event.status === 'published' ? 'green' : event.status === 'draft' ? 'gray' : 'red'}>{event.status}</Badge></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button variant="ghost"  size="sm" onClick={() => navigate(`/admin/events/${event._id}/edit`)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteClick(event)}>Del</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        type="danger"
        title={`Delete "${targetEvent?.title}"?`}
        message="All registrations for this event will be lost. This cannot be undone."
        confirmLabel="Yes, Delete Event"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}

export default ManageEventsPage;