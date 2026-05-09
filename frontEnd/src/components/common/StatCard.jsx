import React, { useEffect, useState } from 'react';
import './StatCard.css';

// ─────────────────────────────────────────────────────────────────────────────
// StatCard.jsx
//
// Usage:
//   <StatCard
//     icon="🎪"
//     label="Total Events"
//     value={42}
//     trend="+8 this month"
//     gradient="indigo"
//     delay={0}
//   />
//
//   <StatCard icon="👥" label="Registrations" value={1838} trend="+124 this week" gradient="blue"   delay={100} />
//   <StatCard icon="✅" label="Attendance Rate" value="87%" trend="+3% vs last month" gradient="green"  delay={200} />
//   <StatCard icon="⚡" label="Active Events"  value={4}   trend="2 ending soon"    gradient="purple" delay={300} />
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  trend,        // small text below value — e.g. "+8 this month"
  trendUp,      // true = green arrow, false = red arrow, undefined = neutral
  gradient = 'indigo', // indigo | blue | green | purple | amber | rose
  delay    = 0,        // stagger delay in ms for entrance animation
}) {

  const [visible, setVisible] = useState(false);

  // Trigger entrance animation after mount + delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay + 60);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`stat-card stat-card--${gradient} ${visible ? 'stat-card--visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* ── Decorative blobs inside card ──────────────────── */}
      <span className="stat-card__blob stat-card__blob--1" />
      <span className="stat-card__blob stat-card__blob--2" />

      {/* ── Top row: icon left, nothing right ─────────────── */}
      <div className="stat-card__top">
        <div className="stat-card__icon-box">
          <span className="stat-card__icon">{icon}</span>
        </div>
      </div>

      {/* ── Value ─────────────────────────────────────────── */}
      <div className="stat-card__value">{value}</div>

      {/* ── Label ─────────────────────────────────────────── */}
      <div className="stat-card__label">{label}</div>

      {/* ── Trend ─────────────────────────────────────────── */}
      {trend && (
        <div className={`stat-card__trend ${trendUp === true ? 'stat-card__trend--up' : trendUp === false ? 'stat-card__trend--down' : ''}`}>
          {trendUp === true  && <span>↑</span>}
          {trendUp === false && <span>↓</span>}
          {trend}
        </div>
      )}
    </div>
  );
}

export default StatCard;
