import React from 'react';
import './SkeletonCard.css';

// ─────────────────────────────────────────────────────────────────────────────
// SkeletonCard.jsx — Apple soft pulse, 4 shape variants
//
// Usage:
//   // Event grid loading (3 cards)
//   {loading && [1,2,3].map(i => <SkeletonCard key={i} type="event" />)}
//
//   // Stat cards loading
//   {loading && [1,2,3,4].map(i => <SkeletonCard key={i} type="stat" />)}
//
//   // Attendance table rows
//   {loading && [1,2,3,4,5].map(i => <SkeletonCard key={i} type="tablerow" />)}
//
//   // My Events list
//   {loading && [1,2,3].map(i => <SkeletonCard key={i} type="listitem" />)}
// ─────────────────────────────────────────────────────────────────────────────

// ── Reusable bone block ───────────────────────────────────────────────────────
function Bone({ width = '100%', height = 14, radius = 6, style = {} }) {
  return (
    <div
      className="skeleton-bone"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

// ── EventCard skeleton ────────────────────────────────────────────────────────
function EventSkeleton() {
  return (
    <div className="skeleton-card skeleton-card--event">
      {/* Image area */}
      <Bone height={176} radius={0} />

      {/* Body */}
      <div className="skeleton-card__body">
        {/* Title */}
        <Bone width="80%" height={16} />
        <Bone width="55%" height={16} style={{ marginTop: 6 }} />

        {/* Meta rows */}
        <div className="skeleton-card__meta">
          <Bone width="65%" height={12} />
          <Bone width="50%" height={12} />
          <Bone width="58%" height={12} />
        </div>

        {/* Capacity bar */}
        <div className="skeleton-card__cap">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Bone width={70}  height={10} />
            <Bone width={40}  height={10} />
          </div>
          <Bone width="100%" height={5} radius={99} />
        </div>
      </div>
    </div>
  );
}

// ── StatCard skeleton ─────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="skeleton-card skeleton-card--stat">
      {/* Icon box */}
      <Bone width={44} height={44} radius={12} />
      {/* Value */}
      <Bone width="55%" height={34} radius={8} style={{ marginTop: 16 }} />
      {/* Label */}
      <Bone width="70%" height={13} radius={6} style={{ marginTop: 10 }} />
      {/* Trend pill */}
      <Bone width={100} height={24} radius={20} style={{ marginTop: 12 }} />
    </div>
  );
}

// ── Table row skeleton (attendance page) ──────────────────────────────────────
function TableRowSkeleton() {
  return (
    <div className="skeleton-card skeleton-card--tablerow">
      {/* Avatar */}
      <Bone width={36} height={36} radius={99} style={{ flexShrink: 0 }} />

      {/* Name + email */}
      <div className="skeleton-tablerow__info">
        <Bone width="60%"  height={13} />
        <Bone width="75%"  height={11} style={{ marginTop: 5 }} />
      </div>

      {/* ID */}
      <Bone width={90} height={12} style={{ flexShrink: 0 }} />

      {/* Date */}
      <Bone width={80} height={12} style={{ flexShrink: 0 }} />

      {/* Toggle */}
      <Bone width={44} height={26} radius={99} style={{ flexShrink: 0 }} />
    </div>
  );
}

// ── List item skeleton (My Events page) ──────────────────────────────────────
function ListItemSkeleton() {
  return (
    <div className="skeleton-card skeleton-card--listitem">
      {/* Thumbnail */}
      <Bone width={80} height={80} radius={12} style={{ flexShrink: 0 }} />

      {/* Info block */}
      <div className="skeleton-listitem__info">
        <Bone width="70%" height={15} />
        <Bone width="45%" height={12} style={{ marginTop: 7 }} />
        <Bone width="55%" height={12} style={{ marginTop: 5 }} />
        {/* Badge */}
        <Bone width={80}  height={22} radius={6} style={{ marginTop: 10 }} />
      </div>

      {/* Button */}
      <Bone width={100} height={36} radius={8} style={{ flexShrink: 0, alignSelf: 'center' }} />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
function SkeletonCard({ type = 'event' }) {
  if (type === 'stat')      return <StatSkeleton />;
  if (type === 'tablerow')  return <TableRowSkeleton />;
  if (type === 'listitem')  return <ListItemSkeleton />;
  return <EventSkeleton />;
}

export default SkeletonCard;
