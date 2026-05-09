import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './SignupPage.css';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics',
  'Mechanical', 'Civil', 'MBA', 'BBA', 'Law', 'Pharmacy', 'Other'
];

function SignupPage() {
  const { register } = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name:       '',
    email:      '',
    password:   '',
    confirm:    '',
    studentId:  '',
    department: '',
    phone:      '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name       = 'Name is required';
    if (!form.email)             e.email      = 'Email is required';
    if (!form.email.includes('@')) e.email    = 'Enter a valid email';
    if (!form.password)          e.password   = 'Password is required';
    if (form.password.length < 6) e.password  = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.studentId.trim())  e.studentId  = 'Student ID is required';
    else if (!/^\d{13,}$/.test(form.studentId.trim())) e.studentId = 'Student ID must be at least 13 digits';
    if (!form.department)        e.department = 'Select your department';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const user = await register({
        name:       form.name,
        email:      form.email,
        password:   form.password,
        studentId:  form.studentId,
        department: form.department,
        phone:      form.phone,
      });
      toast.success(`Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* Left brand panel */}
      <div className="signup-left">
        <div className="signup-left__inner">
    <div className="login-left__logo">
            <img src="/logo.png" alt="Logistic Planner" className="login-left__logo-img" />
          </div>
          <h1 className="signup-left__title">Logistic Planner</h1>
          <p className="signup-left__subtitle">
            Join thousands of students discovering and attending college events.
          </p>
          <div className="signup-left__steps">
            {[
              { n:'1', t:'Create Account',    s:'Fill your details below'       },
              { n:'2', t:'Browse Events',     s:'Discover upcoming events'      },
              { n:'3', t:'Register & Attend', s:'Get your QR ticket instantly'  },
            ].map(step => (
              <div key={step.n} className="signup-step">
                <div className="signup-step__num">{step.n}</div>
                <div>
                  <div className="signup-step__title">{step.t}</div>
                  <div className="signup-step__sub">{step.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="signup-left__blob signup-left__blob--1" />
        <div className="signup-left__blob signup-left__blob--2" />
      </div>

      {/* Right form panel */}
      <div className="signup-right">
        <div className="signup-form-wrap">

          <div className="signup-form__header">
            <h2 className="signup-form__title">Create Account</h2>
            <p className="signup-form__sub">
              Already have an account?{' '}
              <Link to="/login" className="signup-form__link">Sign in</Link>
            </p>
          </div>

          <div className="signup-fields">
            {/* Row 1 */}
            <div className="signup-row-2">
              <Input
                label="Full Name"
                icon="👤"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                error={errors.name}
              />
              <Input
                label="Student ID"
                icon="🎓"
                placeholder="2303031240129"
                value={form.studentId}
                onChange={e => set('studentId', e.target.value.replace(/\D/g, ''))}
                error={errors.studentId}
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              placeholder='name@paruluniversity.ac.in'
              type="email"
              icon="✉️"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              error={errors.email}
            />

            {/* Department */}
            <div className="signup-select-wrap">
              <label className="signup-select-label">Department</label>
              <select
                className={`signup-select ${errors.department ? 'signup-select--error' : ''}`}
                value={form.department}
                onChange={e => set('department', e.target.value)}
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="signup-select-error">{errors.department}</p>}
            </div>

            {/* Phone */}
            <Input
              label="Phone"
              type="tel"
              placeholder='9874563210'
              icon="📱"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
            />

            {/* Passwords */}
            <div className="signup-row-2">
              <Input
                label="Password"
                type="password"
                icon="🔒"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                type="password"
                icon="🔒"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                error={errors.confirm}
              />
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            loading={loading}
            onClick={handleSubmit}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </Button>

          <p className="signup-form__hint">
            By signing up you agree to the university event policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
