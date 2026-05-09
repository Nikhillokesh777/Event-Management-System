import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import { STUDENT_NOTIFICATIONS, ADMIN_NOTIFICATIONS } from '../../data/mockData';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifs, setNotifs] = useState(
    isAdmin ? ADMIN_NOTIFICATIONS : STUDENT_NOTIFICATIONS
  );

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unread = notifs.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const studentLinks = [
    { to: '/dashboard', label: 'Home' },
    { to: '/my-events', label: 'My Events' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/events', label: 'Events' },
    { to: '/admin/attendance', label: 'Attendance' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;
  const homePath = isAdmin ? '/admin' : '/dashboard';

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__brand" onClick={() => navigate(homePath)}>
            <div className="navbar__logo">
              <img src="/logo.png" alt="Logistic Planner" className="navbar__logo-img" />
            </div>
            <span className="navbar__brand-name">Logistic Planner</span>
          </div>

          <div className="navbar__links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar__right">
            <div className="navbar__notif-wrap" ref={notifRef}>
              <button
                className="navbar__icon-btn"
                onClick={() => {
                  setNotifOpen((p) => !p);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unread > 0 && <span className="navbar__badge">{unread}</span>}
              </button>

              {notifOpen && (
                <div className="navbar__dropdown navbar__dropdown--notif">
                  <div className="notif__header">
                    <span className="notif__title">Notifications</span>
                    {unread > 0 && (
                      <button className="notif__mark-read" onClick={markAllRead}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="notif__list">
                    {notifs.length === 0 ? (
                      <p className="notif__empty">No notifications</p>
                    ) : (
                      notifs.map((n) => (
                        <div
                          key={n._id}
                          className={`notif__item ${!n.isRead ? 'notif__item--unread' : ''}`}
                          onClick={() =>
                            setNotifs((prev) =>
                              prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
                            )
                          }
                        >
                          <div className="notif__dot-wrap">
                            {!n.isRead && <span className="notif__dot" />}
                          </div>
                          <div className="notif__body">
                            <p className="notif__msg">{n.message}</p>
                            <span className="notif__time">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="navbar__profile-wrap" ref={profileRef}>
              <div
                className="navbar__avatar-btn"
                onClick={() => {
                  setProfileOpen((p) => !p);
                  setNotifOpen(false);
                }}
              >
                <Avatar
                  name={user?.name}
                  color={user?.color || '#4F46E5'}
                  size="sm"
                  onClick={() => {}}
                />
                <span className="navbar__user-name">{user?.name?.split(' ')[0]}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`navbar__chevron ${profileOpen ? 'navbar__chevron--open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {profileOpen && (
                <div className="navbar__dropdown navbar__dropdown--profile">
                  <div className="profile-drop__header">
                    <Avatar name={user?.name} color={user?.color || '#4F46E5'} size="md" />
                    <div>
                      <div className="profile-drop__name">{user?.name}</div>
                      <div className="profile-drop__email">{user?.email}</div>
                    </div>
                  </div>

                  <div className="profile-drop__divider" />

                  <button
                    className="profile-drop__item"
                    onClick={() => {
                      navigate(isAdmin ? '/admin/profile' : '/profile');
                      setProfileOpen(false);
                    }}
                  >
                    <span>My Profile</span>
                  </button>

                  {!isAdmin && (
                    <button
                      className="profile-drop__item"
                      onClick={() => {
                        navigate('/my-events');
                        setProfileOpen(false);
                      }}
                    >
                      <span>My Events</span>
                    </button>
                  )}

                  <div className="profile-drop__divider" />

                  <button className="profile-drop__item profile-drop__item--danger" onClick={handleLogout}>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button
              className="navbar__hamburger"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Menu"
            >
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--1-open' : ''}`} />
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--2-open' : ''}`} />
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--3-open' : ''}`} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="navbar__mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="navbar__mobile-divider" />
            <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="navbar__spacer" />
    </>
  );
}

export default Navbar;
