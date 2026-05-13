import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import Input from '../../components/common/Input';
import './LoginPage.css';

function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!email) nextErrors.email = 'Email is required';
    else if (!email.includes('@')) nextErrors.email = 'Enter a valid email';

    if (!password) nextErrors.password = 'Password is required';
    else if (password.length < 4) nextErrors.password = 'Minimum 4 characters';

    return nextErrors;
  };

  const handleSubmit = async (preferredRole) => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const user = await login(email, password);

      if (preferredRole && user.role !== preferredRole) {
        throw new Error(`This account is not a ${preferredRole} account`);
      }

      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (role) => {
    const demoEmail = role === 'admin' ? 'admin@example.com' : 'student@example.com';
    const demoPassword = role === 'admin' ? 'change-me-admin' : 'change-me-student';
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
    setLoading(true);
    try {
      const user = await login(demoEmail, demoPassword);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left__inner">
          {/* <div className="login-left__logo">
            <img src="/logo.png" alt="Logistic Planner" className="login-left__logo-img" />
          </div> */}
          <h1 className="login-left__title">Logistic Planner</h1>
          <p className="login-left__subtitle">
            Your college event hub to discover, register, and attend events in one place.
          </p>

          <div className="login-left__pills">
            {['Discover Events', 'Easy Registration', 'Track Attendance', 'Live Updates'].map((feature) => (
              <span key={feature} className="login-left__pill">{feature}</span>
            ))}
          </div>
        </div>

        <div className="login-left__blob login-left__blob--1" />
        <div className="login-left__blob login-left__blob--2" />
        <div className="login-left__blob login-left__blob--3" />
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form__header">
            <h2 className="login-form__title">Welcome back</h2>
            <p className="login-form__sub">Choose your access and sign in.</p>
          </div>

          <div className="login-demo">
            <span className="login-demo__label">Quick fill</span>
            <button type="button" className="login-demo__btn" onClick={() => fillDemo('student')}>
              Student LogIn
            </button>
            <button
              type="button"
              className="login-demo__btn login-demo__btn--admin"
              onClick={() => fillDemo('admin')}
            >
              Admin LogIn
            </button>
          </div>

          <div className="login-form__fields">
            <Input
              label="College Email"
              type="email"
              icon="✉️"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              icon="🔒"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          </div>

          <div className="login-actions">
            <button
              type="button"
              className="login-submit login-submit--student"
              onClick={() => handleSubmit('student')}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In as Student'}
            </button>
            <button
              type="button"
              className="login-submit login-submit--admin"
              onClick={() => handleSubmit('admin')}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </div>

          <div className="login-links">
            <Link to="/forgot-password" className="login-links__forgot">
              Forgot Password?
            </Link>
          </div>

          <p className="login-form__hint">
            No account?{' '}
            <Link to="/signup" className="login-form__signup-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
