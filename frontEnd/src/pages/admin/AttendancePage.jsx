 import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Toggle from '../../components/common/Toggle';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';
import { fetchEvents, fetchAttendance, markAttendance } from '../../services/api';
import './AttendancePage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function AttendancePage() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAtt, setLoadingAtt] = useState(false);

  // Load published events
  useEffect(() => {
    fetchEvents()
      .then(res => {
        const published = (res.data.events || []).filter(e => e.status === 'published');
        setEvents(published);
        if (published.length > 0) setSelectedEventId(published[0]._id);
      })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoadingEvents(false));
  }, []);

  // Load attendance when event changes
  useEffect(() => {
    if (!selectedEventId) return;
    setLoadingAtt(true);
    fetchAttendance(selectedEventId)
      .then(res => setAttendance(res.data.attendance || []))
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoadingAtt(false));
  }, [selectedEventId]);

  const handleToggle = async (record, val) => {
    try {
      await markAttendance(selectedEventId, record.student._id, val);
      setAttendance(prev =>
        prev.map(r => r.registrationId === record.registrationId
          ? { ...r, attendanceMarked: val } : r)
      );
      toast.info(val ? 'Attendance marked ✓' : 'Attendance unmarked');
    } catch {
      toast.error('Failed to update attendance');
    }
  };

  const marked = attendance.filter(r => r.attendanceMarked).length;
  const rate = attendance.length ? Math.round((marked / attendance.length) * 100) : 0;
  const selectedEvent = events.find(e => e._id === selectedEventId);

  return (
    <div className="attendance-page">
      <Navbar />
      <PageWrapper>
        <div className="att__header">
          <h1 className="att__title">Attendance</h1>
          <p className="att__sub">Mark and track student attendance per event</p>
        </div>

        {loadingEvents ? (
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 40, width: 160, background: '#E9EBF0', borderRadius: 10, animation: 'pulse 1.6s ease-in-out infinite' }} />)}
          </div>
        ) : (
          <div className="att__event-selector">
            {events.map(event => (
              <button
                key={event._id}
                className={`att__event-btn ${selectedEventId === event._id ? 'att__event-btn--active' : ''}`}
                onClick={() => setSelectedEventId(event._id)}
              >
                {event.image && <img src={event.image} alt="" className="att__event-btn-img" />}
                <span className="att__event-btn-name">{event.title}</span>
              </button>
            ))}
          </div>
        )}

        {selectedEvent && (
          <div className="att__stats">
            <div className="att__stat"><span className="att__stat-val">{attendance.length}</span><span className="att__stat-label">Registered</span></div>
            <div className="att__stat"><span className="att__stat-val" style={{ color: '#10B981' }}>{marked}</span><span className="att__stat-label">Present</span></div>
            <div className="att__stat"><span className="att__stat-val" style={{ color: '#EF4444' }}>{attendance.length - marked}</span><span className="att__stat-label">Absent</span></div>
            <div className="att__stat"><span className="att__stat-val" style={{ color: '#4F46E5' }}>{rate}%</span><span className="att__stat-label">Rate</span></div>
          </div>
        )}

        <div className="att__table-wrap">
          <div className="att__table-header">
            <h3 className="att__table-title">{selectedEvent?.title} — Student List</h3>
            <Badge color={rate >= 80 ? 'green' : rate >= 60 ? 'amber' : 'red'}>{rate}% Attendance</Badge>
          </div>

          {loadingAtt ? (
            [1,2,3,4,5].map(i => <SkeletonCard key={i} type="tablerow" />)
          ) : attendance.length === 0 ? (
            <EmptyState type="no-students" />
          ) : (
            <table className="att__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Registered</th>
                  <th>Payment</th>
                  <th>Present</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => {
                  const student = record.student;
                  return (
                    <tr key={record.registrationId} className={`att__row ${record.attendanceMarked ? 'att__row--present' : ''}`}>
                      <td>
                        <div className="att__student-cell">
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <div className="att__student-name">{student.name}</div>
                            <div className="att__student-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="att__cell">{student.studentId || '—'}</td>
                      <td className="att__cell">
                        <Badge color="blue" size="sm">{student.department || '—'}</Badge>
                      </td>
                      <td className="att__cell">{formatDate(record.registeredAt)}</td>
                      <td className="att__cell">
                        <Badge color={selectedEvent?.isFree ? 'green' : 'amber'} size="sm">
                          {selectedEvent?.isFree ? 'Free' : 'Paid'}
                        </Badge>
                      </td>
                      <td>
                        <Toggle
                          checked={record.attendanceMarked}
                          onChange={v => handleToggle(record, v)}
                          color="green" size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}

export default AttendancePage;