 import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { fetchMyRegistrations } from '../../services/api';
import api from '../../services/api';
import './ProfilePage.css';
import { useEffect } from 'react';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, attended: 0, registered: 0 });
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  useEffect(() => {
    fetchMyRegistrations()
      .then(res => {
        const regs = res.data.registrations || [];
        setStats({
          total: regs.length,
          attended: regs.filter(r => r.status === 'attended').length,
          registered: regs.filter(r => r.status === 'registered').length,
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateProfile(res.data.user || form);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <PageWrapper>
        <h1 className="pf__page-title">My Profile</h1>
        <div className="pf__layout">
          <div className="pf__left">
            <div className="pf__avatar-card">
              <Avatar name={user?.name} color={user?.color || '#4F46E5'} size="2xl" ring />
              <div className="pf__avatar-name">{user?.name}</div>
              <div className="pf__avatar-email">{user?.email}</div>
              <Badge color="blue">{user?.department || 'Student'}</Badge>
              <div className="pf__student-id">{user?.studentId}</div>
            </div>
            <div className="pf__mini-stats">
              <div className="pf__mini-stat">
                <div className="pf__mini-stat-val" style={{ color: '#4F46E5' }}>{stats.total}</div>
                <div className="pf__mini-stat-label">Total Registered</div>
              </div>
              <div className="pf__mini-stat">
                <div className="pf__mini-stat-val" style={{ color: '#10B981' }}>{stats.attended}</div>
                <div className="pf__mini-stat-label">Attended</div>
              </div>
              <div className="pf__mini-stat">
                <div className="pf__mini-stat-val" style={{ color: '#3B82F6' }}>{stats.registered}</div>
                <div className="pf__mini-stat-label">Upcoming</div>
              </div>
            </div>
          </div>

          <div className="pf__right">
            <div className="pf__details-card">
              <div className="pf__details-header">
                <h3 className="pf__details-title">Personal Information</h3>
                {!editing && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
                )}
              </div>

              {editing ? (
                <div className="pf__form">
                  <Input label="Full Name"     icon="👤" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  <Input label="Phone Number"  icon="📱" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  <Input label="Department"    icon="🏛️" value={form.department}
                    onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
                  <div className="pf__form-actions">
                    <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
                    <Button loading={saving} onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="pf__info-list">
                  {[
                    { icon: '👤', label: 'Full Name',   val: user?.name },
                    { icon: '✉️', label: 'Email',       val: user?.email },
                    { icon: '📱', label: 'Phone',       val: user?.phone || '—' },
                    { icon: '🏛️', label: 'Department',  val: user?.department },
                    { icon: '🎓', label: 'Student ID',  val: user?.studentId || '—' },
                  ].map(row => (
                    <div key={row.label} className="pf__info-row">
                      <span className="pf__info-icon">{row.icon}</span>
                      <div>
                        <div className="pf__info-label">{row.label}</div>
                        <div className="pf__info-val">{row.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default ProfilePage;