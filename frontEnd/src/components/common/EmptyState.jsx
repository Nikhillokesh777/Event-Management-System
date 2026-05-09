import React from 'react';
import './EmptyState.css';

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState.jsx — CSS illustrations, gentle float entrance, 5 presets
//
// Usage:
//   <EmptyState type="no-events"        onAction={() => {}} />
//   <EmptyState type="no-registrations" onAction={() => navigate('/dashboard')} />
//   <EmptyState type="no-students" />
//   <EmptyState type="no-search"        onAction={() => setSearch('')} />
//   <EmptyState type="no-notifications" />
//
//   // Custom (fully manual)
//   <EmptyState
//     illustration={<div className="empty-illus--custom">📋</div>}
//     title="No data yet"
//     subtitle="Nothing to show here."
//     actionLabel="Refresh"
//     onAction={fetchData}
//   />
// ─────────────────────────────────────────────────────────────────────────────

// ── CSS Illustrations ─────────────────────────────────────────────────────────

function IllusNoEvents() {
  return (
    <div className="empty-illus">
      {/* Calendar base */}
      <div className="illus-calendar">
        <div className="illus-calendar__header" />
        <div className="illus-calendar__rings">
          <span /><span />
        </div>
        <div className="illus-calendar__body">
          <div className="illus-calendar__row">
            {[1,2,3,4].map(i => <span key={i} className="illus-calendar__cell" />)}
          </div>
          <div className="illus-calendar__row">
            {[1,2,3,4].map(i => <span key={i} className="illus-calendar__cell" />)}
          </div>
          {/* Big X over calendar */}
          <div className="illus-calendar__x">✕</div>
        </div>
      </div>
      {/* Stars around */}
      <span className="illus-star illus-star--1">✦</span>
      <span className="illus-star illus-star--2">✦</span>
      <span className="illus-star illus-star--3">·</span>
    </div>
  );
}

function IllusNoRegistrations() {
  return (
    <div className="empty-illus">
      {/* Clipboard */}
      <div className="illus-clipboard">
        <div className="illus-clipboard__clip" />
        <div className="illus-clipboard__body">
          <div className="illus-clipboard__line illus-clipboard__line--short" />
          <div className="illus-clipboard__line" />
          <div className="illus-clipboard__line illus-clipboard__line--med" />
          {/* Sad face */}
          <div className="illus-clipboard__face">
            <span className="illus-face__eyes">• •</span>
            <span className="illus-face__mouth">⌢</span>
          </div>
        </div>
      </div>
      <span className="illus-star illus-star--1">✦</span>
      <span className="illus-star illus-star--2">·</span>
    </div>
  );
}

function IllusNoStudents() {
  return (
    <div className="empty-illus">
      {/* Group of people silhouettes */}
      <div className="illus-people">
        <div className="illus-person illus-person--left">
          <div className="illus-person__head" />
          <div className="illus-person__body" />
        </div>
        <div className="illus-person illus-person--center">
          <div className="illus-person__head illus-person__head--main" />
          <div className="illus-person__body illus-person__body--main" />
        </div>
        <div className="illus-person illus-person--right">
          <div className="illus-person__head" />
          <div className="illus-person__body" />
        </div>
        {/* Question mark */}
        <div className="illus-people__q">?</div>
      </div>
      <span className="illus-star illus-star--1">✦</span>
      <span className="illus-star illus-star--3">✦</span>
    </div>
  );
}

function IllusNoSearch() {
  return (
    <div className="empty-illus">
      {/* Magnifier */}
      <div className="illus-search">
        <div className="illus-search__glass">
          <div className="illus-search__circle">
            <span className="illus-search__x">✕</span>
          </div>
          <div className="illus-search__handle" />
        </div>
      </div>
      <span className="illus-star illus-star--1">·</span>
      <span className="illus-star illus-star--2">✦</span>
      <span className="illus-star illus-star--3">·</span>
    </div>
  );
}

function IllusNoNotifications() {
  return (
    <div className="empty-illus">
      {/* Bell */}
      <div className="illus-bell">
        <div className="illus-bell__top" />
        <div className="illus-bell__body" />
        <div className="illus-bell__base" />
        <div className="illus-bell__clapper" />
        {/* Z z z */}
        <span className="illus-bell__z illus-bell__z--1">z</span>
        <span className="illus-bell__z illus-bell__z--2">z</span>
        <span className="illus-bell__z illus-bell__z--3">Z</span>
      </div>
    </div>
  );
}

// ── Preset configs ────────────────────────────────────────────────────────────
const PRESETS = {
  'no-events': {
    illustration: <IllusNoEvents />,
    title:        'No Events Found',
    subtitle:     'There are no events matching your current filter. Try switching to a different category.',
    actionLabel:  'Browse All Events',
  },
  'no-registrations': {
    illustration: <IllusNoRegistrations />,
    title:        'No Registered Events',
    subtitle:     "You haven't registered for any events yet. Explore upcoming events and grab your spot!",
    actionLabel:  'Explore Events',
  },
  'no-students': {
    illustration: <IllusNoStudents />,
    title:        'No Students Registered',
    subtitle:     'No students have registered for this event yet. Share the event to get registrations.',
    actionLabel:  null,
  },
  'no-search': {
    illustration: <IllusNoSearch />,
    title:        'No Results Found',
    subtitle:     "We couldn't find anything matching your search. Try different keywords or clear the search.",
    actionLabel:  'Clear Search',
  },
  'no-notifications': {
    illustration: <IllusNoNotifications />,
    title:        "You're All Caught Up",
    subtitle:     'No new notifications right now. We\'ll let you know when something happens.',
    actionLabel:  null,
  },
};

// ── Main component ────────────────────────────────────────────────────────────
function EmptyState({
  type,
  illustration,
  title,
  subtitle,
  actionLabel,
  onAction,
  compact = false,  // smaller version for dropdowns (notifications)
}) {
  const preset = type ? PRESETS[type] : {};

  const finalIllus       = illustration || preset.illustration;
  const finalTitle       = title        || preset.title;
  const finalSubtitle    = subtitle     || preset.subtitle;
  const finalActionLabel = actionLabel  !== undefined ? actionLabel : preset.actionLabel;

  return (
    <div className={`empty-state ${compact ? 'empty-state--compact' : ''}`}>

      {/* Illustration */}
      {finalIllus && (
        <div className="empty-state__illus">{finalIllus}</div>
      )}

      {/* Text */}
      <div className="empty-state__text">
        {finalTitle    && <h3 className="empty-state__title">{finalTitle}</h3>}
        {finalSubtitle && <p  className="empty-state__subtitle">{finalSubtitle}</p>}
      </div>

      {/* Action button */}
      {finalActionLabel && onAction && (
        <button className="empty-state__btn" onClick={onAction}>
          {finalActionLabel}
        </button>
      )}

    </div>
  );
}

export default EmptyState;
