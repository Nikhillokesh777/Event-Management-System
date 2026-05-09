import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import EventCard from '../../components/common/EventCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../hooks/useAuth';
import { fetchEvents, registerForEvent, fetchMyRegistrations, cancelRegistration } from '../../services/api';
import './StudentDashboard.css';

const FILTERS = ['All', 'Upcoming', 'Free', 'College', 'External'];

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [myRegIds, setMyRegIds] = useState([]);
  const [registrationMap, setRegistrationMap] = useState({});
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [registerModal, setRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          fetchEvents(),
          fetchMyRegistrations(),
        ]);

        setEvents(evRes.data.events || []);

        const activeRegs = (regRes.data.registrations || []).filter((r) => r.status === 'registered');
        setMyRegIds(activeRegs.map((r) => r.event?._id || r.event));
        setRegistrationMap(
          activeRegs.reduce((acc, reg) => {
            const eventId = reg.event?._id || reg.event;
            acc[eventId] = reg._id;
            return acc;
          }, {})
        );
      } catch (err) {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isUpcoming = (event) => new Date(event.date) >= new Date();

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchSearch = !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.organizer.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === 'All' ? true :
          filter === 'Upcoming' ? isUpcoming(e) :
            filter === 'Free' ? e.isFree :
              filter === 'College' ? e.type === 'college' :
                filter === 'External' ? e.type === 'external' : true;

      return matchSearch && matchFilter;
    });
  }, [events, filter, search]);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setRegisterModal(true);
  };

  const handleConfirmRegister = async () => {
    setRegistering(true);
    try {
      const res = await registerForEvent(selectedEvent._id);
      const registrationId = res.data.registration?._id;

      setMyRegIds((prev) => [...prev, selectedEvent._id]);
      if (registrationId) {
        setRegistrationMap((prev) => ({ ...prev, [selectedEvent._id]: registrationId }));
      }

      setEvents((prev) => prev.map((e) =>
        e._id === selectedEvent._id ? { ...e, registeredCount: e.registeredCount + 1 } : e
      ));
      setRegisterModal(false);
      toast.success(`Registered for ${selectedEvent.title}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleWithdraw = async (event) => {
    const registrationId = registrationMap[event._id];
    if (!registrationId) {
      toast.error('Registration record not found');
      return;
    }

    setWithdrawingId(event._id);
    try {
      await cancelRegistration(registrationId);
      setMyRegIds((prev) => prev.filter((id) => id !== event._id));
      setRegistrationMap((prev) => {
        const next = { ...prev };
        delete next[event._id];
        return next;
      });
      setEvents((prev) => prev.map((e) =>
        e._id === event._id ? { ...e, registeredCount: Math.max((e.registeredCount || 1) - 1, 0) } : e
      ));
      toast.success(`Withdrawn from ${event.title}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdraw failed');
    } finally {
      setWithdrawingId('');
    }
  };

  return (
    <div className="student-dashboard">
      <Navbar />
      <PageWrapper>
        <div className="dash__header">
          <div>
            <h1 className="dash__title">Hey, {user?.name?.split(' ')[0]}</h1>
            <p className="dash__subtitle">Discover and register for upcoming events</p>
          </div>
          <div className="dash__search">
            <span className="dash__search-icon">Search</span>
            <input
              className="dash__search-input"
              placeholder="Search events, venues, organizers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="dash__search-clear" onClick={() => setSearch('')}>x</button>
            )}
          </div>
        </div>

        <div className="dash__filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`dash__filter-btn ${filter === f ? 'dash__filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          <span className="dash__count">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="events-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} type="event" />)}
          </div>
        ) : filtered.length === 0 ? (
          search
            ? <EmptyState type="no-search" onAction={() => setSearch('')} />
            : <EmptyState type="no-events" onAction={() => setFilter('All')} />
        ) : (
          <div className="events-grid">
            {filtered.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                registered={myRegIds.includes(event._id)}
                withdrawing={withdrawingId === event._id}
                onView={(e) => navigate(`/events/${e._id}`)}
                onRegister={handleRegisterClick}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        )}
      </PageWrapper>

      <Modal
        isOpen={registerModal}
        onClose={() => setRegisterModal(false)}
        type="register"
        event={selectedEvent}
        onConfirm={handleConfirmRegister}
        loading={registering}
      />
    </div>
  );
}

export default StudentDashboard;
