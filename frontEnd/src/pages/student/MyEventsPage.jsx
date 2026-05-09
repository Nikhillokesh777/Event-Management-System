import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import SkeletonCard from '../../components/common/SkeletonCard';
import { useToast } from '../../components/common/Toast';
import { fetchMyRegistrations, cancelRegistration } from '../../services/api';
import './MyEventsPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const formatFee = (event) => event?.isFree ? 'FREE' : `Rs.${event?.fee}`;

function MyEventsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState('');

  useEffect(() => {
    fetchMyRegistrations()
      .then((res) => setRegistrations(res.data.registrations || []))
      .catch(() => toast.error('Failed to load your events'))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (registrationId, eventTitle) => {
    setWithdrawingId(registrationId);
    try {
      await cancelRegistration(registrationId);
      setRegistrations((prev) => prev.filter((reg) => reg._id !== registrationId));
      toast.success(`Withdrawn from ${eventTitle}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdraw failed');
    } finally {
      setWithdrawingId('');
    }
  };

  const statusColor = (s) =>
    s === 'attended' ? 'green' : s === 'registered' ? 'blue' : s === 'cancelled' ? 'red' : 'gray';

  return (
    <div className="my-events-page">
      <Navbar />
      <PageWrapper>
        <div className="me__header">
          <div>
            <h1 className="me__title">My Events</h1>
            <p className="me__sub">All events you've registered for</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} icon="->">Browse Events</Button>
        </div>

        <div className="me__stats">
          {[
            { label: 'Registered', val: registrations.filter((r) => r.status === 'registered').length, color: '#4F46E5' },
            { label: 'Attended', val: registrations.filter((r) => r.status === 'attended').length, color: '#10B981' },
            { label: 'Total', val: registrations.length, color: '#111827' },
          ].map((s) => (
            <div key={s.label} className="me__stat">
              <div className="me__stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="me__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} type="listitem" />)}
          </div>
        ) : registrations.length === 0 ? (
          <EmptyState type="no-registrations" onAction={() => navigate('/dashboard')} />
        ) : (
          <div className="me__list">
            {registrations.map((reg) => {
              const event = reg.event;
              if (!event) return null;
              return (
                <div key={reg._id} className="me__item">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="me__item-img" />
                  ) : (
                    <div className="me__item-img" style={{ background: '#EEF2FF' }} />
                  )}
                  <div className="me__item-info">
                    <h3 className="me__item-title">{event.title}</h3>
                    <div className="me__item-meta">
                      <span>Date {formatDate(event.date)}</span>
                      <span>Time {event.time}</span>
                      <span>Venue {event.venue}</span>
                    </div>
                    <div className="me__item-bottom">
                      <Badge color={statusColor(reg.status)}>
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </Badge>
                      <Badge color={event.isFree ? 'green' : 'amber'}>{formatFee(event)}</Badge>
                      <span className="me__item-reg-id">{reg.registrationId}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {reg.status === 'registered' && new Date(event.date) >= new Date() && (
                      <Button
                        variant="danger"
                        size="sm"
                        loading={withdrawingId === reg._id}
                        onClick={() => handleWithdraw(reg._id, event.title)}
                      >
                        {withdrawingId === reg._id ? 'Withdrawing...' : 'Withdraw'}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event._id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageWrapper>
    </div>
  );
}

export default MyEventsPage;
