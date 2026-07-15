import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiMap, FiShield } from 'react-icons/fi';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('admin@rhm.local');
  const [password, setPassword] = useState('RoadHealth123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('rhm_token', response.data.token);
      localStorage.setItem('rhm_admin', response.data.admin.email);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Cannot reach the Road Health Map API. Make sure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="login-brand"><div className="brand-mark"><FiMap /></div>Road Health Map</div>
        <div className="login-form-wrap">
          <p className="eyebrow">Authority portal</p>
          <h1>Welcome back</h1>
          <p className="login-copy">Sign in to monitor road conditions, sensor activity, and citizen reports.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-shell"><FiMail /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-shell"><FiLock /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)} aria-label="Show password">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
            </div>
            <div className="login-meta"><label className="remember"><input type="checkbox" defaultChecked /> Keep me signed in</label><span>Local secure access</span></div>
            {error && <p className="login-error">{typeof error === 'string' ? error : 'Sign in failed. Check your credentials.'}</p>}
            <button className="primary-button login-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in to dashboard'}</button>
          </form>
          <div className="demo-credentials"><strong>Road monitoring workspace</strong><br />Secure access for authorized personnel</div>
        </div>
      </section>
      <aside className="login-visual" style={{ backgroundImage: `linear-gradient(160deg, rgba(17,53,39,.18), rgba(17,53,39,.88)), url(${process.env.PUBLIC_URL}/images/bg.jpg)` }}>
        <div className="visual-content">
          <span className="visual-kicker"><FiShield /> Evidence-led maintenance</span>
          <h2>See road health before it becomes a hazard.</h2>
          <p>Turn accelerometer readings into clear priorities for safer routes and faster maintenance decisions.</p>
        </div>
      </aside>
    </div>
  );
}
