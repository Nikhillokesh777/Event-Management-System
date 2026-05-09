 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';          // ← added useNavigate
import { useToast } from '../../components/common/Toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { forgotPassword, verifyOtp, resetPassword } from '../../services/api'; // ← use named exports
import './Forgotpasswordpage.css';                              // ← exact filename casing fixed

// 3 steps: email → otp → new password
function ForgotPasswordPage() {
  const toast    = useToast();
  const navigate = useNavigate();                              // ← replaces window.location

  const [step,     setStep]     = useState(1);                // 1 | 2 | 3
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  // ── STEP 1 — Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email)               { setErrors({ email: 'Email is required' });    return; }
    if (!email.includes('@')) { setErrors({ email: 'Enter a valid email' });  return; }
    setErrors({});
    setLoading(true);
    try {
      await forgotPassword(email);                             // ← named export from api.js
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2 — Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) { setErrors({ otp: 'Enter the OTP sent to your email' }); return; }
    setErrors({});
    setLoading(true);
    try {
      await verifyOtp(email, otp);                            // ← named export from api.js
      toast.success('OTP verified!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3 — Reset Password ────────────────────────────────────────────────
  const handleReset = async () => {
    const e = {};
    if (!password)            e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (password !== confirm) e.confirm  = 'Passwords do not match';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await resetPassword(email, otp, password);              // ← named export from api.js
      toast.success('Password reset successfully! Please login.');
      navigate('/login', { replace: true });                  // ← React Router navigate, no full reload
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Step metadata ──────────────────────────────────────────────────────────
  const steps = [
    { n: 1, label: 'Enter Email'  },
    { n: 2, label: 'Verify OTP'   },
    { n: 3, label: 'New Password' },
  ];

  return (
    <div className="fp-page">

      {/* ── Left panel ───────────────────────────────────────────── */}
      <div className="fp-left">
        <div className="fp-left__inner">
          <div className="fp-left__logo">🔐</div>
          <h1 className="fp-left__title">Reset Password</h1>
          <p className="fp-left__sub">
            We'll send a one-time code to your email to verify your identity.
          </p>

          {/* Progress indicator */}
          <div className="fp-steps">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className={`fp-step ${step >= s.n ? 'fp-step--done' : ''} ${step === s.n ? 'fp-step--active' : ''}`}>
                  <div className="fp-step__circle">
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <span className="fp-step__label">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`fp-step__line ${step > s.n ? 'fp-step__line--done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="fp-blob fp-blob--1" />
        <div className="fp-blob fp-blob--2" />
      </div>

      {/* ── Right panel ──────────────────────────────────────────── */}
      <div className="fp-right">
        <div className="fp-form-wrap">

          {/* Step 1 — Email */}
          {step === 1 && (
            <>
              <div className="fp-form__header">
                <h2 className="fp-form__title">Forgot Password?</h2>
                <p className="fp-form__sub">Enter your registered email address and we'll send you an OTP.</p>
              </div>
              <div className="fp-form__fields">
                <Input
                  label="Email Address"
                  type="email"
                  icon="✉️"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={errors.email}
                />
              </div>
              <Button fullWidth size="lg" loading={loading} onClick={handleSendOtp}>
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </Button>
            </>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <>
              <div className="fp-form__header">
                <h2 className="fp-form__title">Enter OTP</h2>
                <p className="fp-form__sub">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>
              <div className="fp-form__fields">
                <Input
                  label="One-Time Password"
                  icon="🔑"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  error={errors.otp}
                />
              </div>
              <Button fullWidth size="lg" loading={loading} onClick={handleVerifyOtp}>
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </Button>
              <button className="fp-resend" onClick={() => { setStep(1); setOtp(''); }}>
                ← Change email or resend
              </button>
            </>
          )}

          {/* Step 3 — New password */}
          {step === 3 && (
            <>
              <div className="fp-form__header">
                <h2 className="fp-form__title">New Password</h2>
                <p className="fp-form__sub">Choose a strong password for your account.</p>
              </div>
              <div className="fp-form__fields">
                <Input
                  label="New Password"
                  type="password"
                  icon="🔒"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={errors.password}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  icon="🔒"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  error={errors.confirm}
                />
              </div>
              <Button fullWidth size="lg" loading={loading} onClick={handleReset}>
                {loading ? 'Resetting...' : 'Reset Password ✓'}
              </Button>
            </>
          )}

          {/* Back to login */}
          <p className="fp-back">
            Remember your password?{' '}
            <Link to="/login" className="fp-back__link">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;