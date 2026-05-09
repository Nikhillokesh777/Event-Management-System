import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { useToast } from '../../components/common/Toast';
import { fetchEventById, registerForEvent, fetchMyRegistrations, cancelRegistration } from '../../services/api';
import './EventDetailsPage.css';

const formatFee = (event) => event.isFree ? 'FREE' : `Rs.${event.fee}`;
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          fetchEventById(id),
          fetchMyRegistrations(),
        ]);
        setEvent(evRes.data.event);

        const activeRegs = (regRes.data.registrations || []).filter((r) => r.status === 'registered');
        const matchingReg = activeRegs.find((r) => (r.event?._id || r.event) === id);
        setRegistered(!!matchingReg);
        setRegistrationId(matchingReg?._id || '');
      } catch {
        toast.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleConfirm = async () => {
    setRegistering(true);
    try {
      const res = await registerForEvent(id);
      setRegistered(true);
      setRegistrationId(res.data.registration?._id || '');
      setEvent((prev) => ({ ...prev, registeredCount: prev.registeredCount + 1 }));
      setShowModal(false);
      toast.success(`Registered for ${event.title}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleWithdraw = async () => {
    if (!registrationId) {
      toast.error('Registration record not found');
      return;
    }

    setWithdrawing(true);
    try {
      await cancelRegistration(registrationId);
      setRegistered(false);
      setRegistrationId('');
      setEvent((prev) => ({ ...prev, registeredCount: Math.max((prev.registeredCount || 1) - 1, 0) }));
      toast.success(`Withdrawn from ${event.title}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdraw failed');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <><Navbar /><Loader section label="Loading event..." /></>;

  if (!event) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2 style={{ fontFamily: 'DM Sans', color: '#111827' }}>Event not found</h2>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </div>
        </PageWrapper>
      </>
    );
  }

  const isUpcoming = new Date(event.date) >= new Date();
  const isFull = event.registeredCount >= event.capacity;
  const fill = Math.min((event.registeredCount / event.capacity) * 100, 100);
  const barColor = fill >= 90 ? '#EF4444' : fill >= 70 ? '#F59E0B' : '#10B981';

  return (
    <div className="event-details-page">
      <Navbar />
      <div className="ed__hero">
        {event.image ? (
          <img src={event.image} alt={event.title} className="ed__hero-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)' }} />
        )}
        <div className="ed__hero-overlay" />
        <div className="ed__hero-content">
          <button className="ed__back" onClick={() => navigate(-1)}>Back</button>
          <div className="ed__hero-badges">
            <Badge color={event.isFree ? 'green' : 'amber'}>{formatFee(event)}</Badge>
            <Badge color={event.type === 'college' ? 'blue' : 'purple'}>
              {event.type === 'college' ? 'College' : 'External'}
            </Badge>
            {!isUpcoming && <Badge color="gray">Past Event</Badge>}
          </div>
        </div>
      </div>

      <PageWrapper>
        <div className="ed__layout">
          <div className="ed__main">
            <h1 className="ed__title">{event.title}</h1>
            <div className="ed__meta-grid">
              {[
                { label: 'Date', val: formatDate(event.date) },
                { label: 'Time', val: event.time },
                { label: 'Venue', val: event.venue },
                { label: 'Organizer', val: event.organizer },
              ].map((m) => (
                <div key={m.label} className="ed__meta-item">
                  <div>
                    <div className="ed__meta-label">{m.label}</div>
                    <div className="ed__meta-val">{m.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ed__section">
              <h3 className="ed__section-title">About this Event</h3>
              <p className="ed__description">{event.description}</p>
            </div>
          </div>

          <div className="ed__sidebar">
            <div className="ed__card">
              <div className="ed__card-fee">
                <span className="ed__card-fee-label">Entry Fee</span>
                <span className={`ed__card-fee-val ${event.isFree ? 'ed__card-fee-val--free' : ''}`}>
                  {formatFee(event)}
                </span>
              </div>
              <div className="ed__card-cap">
                <div className="ed__card-cap-row">
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#6B7280' }}>Seats filled</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, color: barColor }}>
                    {event.registeredCount}/{event.capacity}
                  </span>
                </div>
                <div className="ed__cap-track">
                  <div className="ed__cap-fill" style={{ width: `${fill}%`, background: barColor }} />
                </div>
                {isFull && <p className="ed__full-msg">This event is fully booked</p>}
              </div>

              {isUpcoming ? (
                registered ? (
                  <Button variant="danger" fullWidth onClick={handleWithdraw} loading={withdrawing}>
                    {withdrawing ? 'Withdrawing...' : 'Withdraw Registration'}
                  </Button>
                ) : (
                  <Button variant="primary" fullWidth size="lg" disabled={isFull} onClick={() => setShowModal(true)}>
                    {isFull ? 'Event Full' : 'Register Now ->'}
                  </Button>
                )
              ) : (
                <Button variant="secondary" fullWidth disabled>Event Has Ended</Button>
              )}
              {registered && <p className="ed__reg-msg">You are registered. You can withdraw before the event.</p>}
            </div>
          </div>
        </div>
      </PageWrapper>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="register"
        event={event}
        onConfirm={handleConfirm}
        loading={registering}
      />
    </div>
  );
}

export default EventDetailsPage;
