 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import StatCard from '../../components/common/StatCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { fetchAdminStats } from '../../services/api';
import './AdminDashboard.css';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const formatFee = (e) => e.isFree ? 'FREE' : `₹${e.fee}`;

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-dashboard">
      <Navbar />
      <PageWrapper>
        <div className="ad__header">
          <div>
            <h1 className="ad__title">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="ad__sub">Here's what's happening with your events today</p>
          </div>
          <Button icon="+" onClick={() => navigate('/admin/events/create')}>New Event</Button>
        </div>

        <div className="ad__stats">
          {loading ? (
            [1, 2, 3, 4].map(i => <SkeletonCard key={i} type="stat" />)
          ) : (
            <>
              <StatCard icon="🎪" label="Total Events"        value={stats?.totalEvents || 0}        trend="+this month" trendUp={true}  gradient="indigo" delay={0}   />
              <StatCard icon="👥" label="Total Registrations" value={stats?.totalRegistrations || 0} trend="all time"    trendUp={true}  gradient="blue"   delay={100} />
              <StatCard icon="✅" label="Attendance Rate"     value={`${stats?.attendanceRate || 0}%`} trend="attended" trendUp={true}  gradient="green"  delay={200} />
              <StatCard icon="⚡" label="Active Events"       value={stats?.activeEvents || 0}        trend="upcoming"               gradient="purple" delay={300} />
            </>
          )}
        </div>

        <div className="ad__section">
          <div className="ad__section-header">
            <h2 className="ad__section-title">Recent Events</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/events')}>View All →</Button>
          </div>

          <div className="ad__table-wrap">
            {loading ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} type="tablerow" />)
            ) : (
              <table className="ad__table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Fee</th>
                    <th>Registered</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentEvents || []).map(event => {
                    const fill = Math.round((event.registeredCount / event.capacity) * 100);
                    return (
                      <tr key={event._id} className="ad__table-row">
                        <td>
                          <div className="ad__event-cell">
                            {event.image
                              ? <img src={event.image} alt="" className="ad__event-thumb" />
                              : <div className="ad__event-thumb" style={{ background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎪</div>
                            }
                            <div>
                              <div className="ad__event-name">{event.title}</div>
                              <div className="ad__event-org">{event.organizer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="ad__cell-text">{formatDate(event.date)}</td>
                        <td><Badge color={event.type === 'college' ? 'blue' : 'purple'} size="sm">{event.type}</Badge></td>
                        <td><Badge color={event.isFree ? 'green' : 'amber'} size="sm">{formatFee(event)}</Badge></td>
                        <td>
                          <div className="ad__reg-cell">
                            <span className="ad__reg-text">{event.registeredCount}/{event.capacity}</span>
                            <div className="ad__reg-bar">
                              <div className="ad__reg-fill" style={{
                                width: `${fill}%`,
                                background: fill >= 90 ? '#EF4444' : fill >= 70 ? '#F59E0B' : '#10B981'
                              }} />
                            </div>
                          </div>
                        </td>
                        <td><Badge size="sm" color={event.status === 'published' ? 'green' : event.status === 'draft' ? 'gray' : 'red'}>{event.status}</Badge></td>
                        <td>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/events/${event._id}/edit`)}>Edit</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default AdminDashboard;