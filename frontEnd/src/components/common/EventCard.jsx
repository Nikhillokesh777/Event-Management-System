import React, { useState } from 'react';
import Badge from './Badge';
import './EventCard.css';
import { formatFee, formatDate, isFull, isUpcoming } from '../../data/mockData';

function EventCard({
  event,
  onView,
  onRegister,
  onWithdraw,
  registered = false,
  withdrawing = false
}) {
  const [imgError, setImgError] = useState(false);

  const full = isFull(event);
  const upcoming = isUpcoming(event);
  const isPast = !upcoming;
  const capacity = event.capacity || 1;
  const fillPercent = Math.min((event.registeredCount / capacity) * 100, 100);

  const barColor = fillPercent >= 90 ? '#EF4444'
    : fillPercent >= 70 ? '#F59E0B'
    : '#10B981';

  const glowColor = event.type === 'college' ? 'rgba(59,130,246,0.45)'
    : 'rgba(139,92,246,0.45)';

  return (
    <div
      className={`event-card ${isPast ? 'event-card--past' : ''}`}
      style={{ '--glow-color': glowColor }}
      onClick={() => onView && onView(event)}
    >
      <div className="event-card__img-wrap">
        {!imgError ? (
          <img
            src={event.image}
            alt={event.title}
            className="event-card__img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="event-card__img-fallback">Event</div>
        )}

        <div className="event-card__overlay" />

        {isPast && <div className="event-card__past-dim"><span>Past Event</span></div>}

        <div className="event-card__badges">
          <Badge color={event.isFree ? 'green' : 'amber'}>
            {formatFee(event)}
          </Badge>
          <Badge color={event.type === 'college' ? 'blue' : 'purple'}>
            {event.type === 'college' ? 'College' : 'External'}
          </Badge>
        </div>

        {upcoming && (
          <div className="event-card__action">
            <button
              className={`event-card__register-btn ${registered ? 'event-card__register-btn--registered' : ''} ${full && !registered ? 'event-card__register-btn--full' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (registered) {
                  onWithdraw && onWithdraw(event);
                  return;
                }
                if (!full) onRegister && onRegister(event);
              }}
              disabled={withdrawing || (full && !registered)}
            >
              {registered
                ? (withdrawing ? 'Withdrawing...' : 'Withdraw')
                : full
                  ? 'Event Full'
                  : 'Register Now ->'}
            </button>
          </div>
        )}
      </div>

      <div className="event-card__body">
        <h3 className="event-card__title">{event.title}</h3>

        <div className="event-card__meta">
          <div className="event-card__meta-row">
            <span className="event-card__meta-icon">Date</span>
            <span>{formatDate(event.date)}</span>
            <span className="event-card__meta-dot">.</span>
            <span>{event.time}</span>
          </div>
          <div className="event-card__meta-row">
            <span className="event-card__meta-icon">Venue</span>
            <span>{event.venue}</span>
          </div>
          <div className="event-card__meta-row">
            <span className="event-card__meta-icon">Org</span>
            <span>{event.organizer}</span>
          </div>
        </div>

        <div className="event-card__capacity">
          <div className="event-card__capacity-header">
            <span className="event-card__capacity-label">Seats filled</span>
            <span className="event-card__capacity-count" style={{ color: barColor }}>
              {event.registeredCount}/{event.capacity}
            </span>
          </div>
          <div className="event-card__capacity-track">
            <div
              className="event-card__capacity-fill"
              style={{
                width: `${fillPercent}%`,
                background: barColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
