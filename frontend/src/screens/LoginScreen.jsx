// ─────────────────────────────────────────────────────────────────────────────
// src/screens/LoginScreen.jsx
// Operator login screen — collects name + email before starting a session.
// Sessions are stored in localStorage so the user stays logged in.
//
// Props:
//   onLogin — function({ name, email }) called on successful login
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontSize: 11, color: 'var(--muted)',
        display: 'block', marginBottom: 6, letterSpacing: '0.5px',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '13px 16px',
          borderRadius: 10,
          background: 'var(--surf2)',
          border: `1px solid ${focused ? 'var(--acc)' : 'var(--brd)'}`,
          color: 'var(--txt)',
          fontSize: 14,
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  );
}

export default function LoginScreen({ onLogin }) {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onLogin({ name: name.trim(), email: email.trim().toLowerCase() });
  };

  return (
    <div style={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 28,
      background: `
        radial-gradient(ellipse 80% 60% at 50% 0%,
          rgba(0,212,170,0.08) 0%, transparent 70%)
      `,
    }}>
      {/* Icon */}
      <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 24, fontWeight: 700,
        letterSpacing: 2, marginBottom: 8,
      }}>
        QR<span style={{ color: 'var(--acc)' }}>TRACK</span>
      </h1>
      <p style={{
        color: 'var(--muted)', fontSize: 13,
        marginBottom: 36, textAlign: 'center', lineHeight: 1.6,
      }}>
        Scan products · Build your master file · Export anytime
      </p>

      {/* Form */}
      <div style={{
        width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <InputField
          label="Your Name"
          value={name}
          onChange={setName}
          placeholder="e.g. Ravi Kumar"
        />
        <InputField
          label="Email Address"
          value={email}
          onChange={setEmail}
          placeholder="ravi@company.com"
          type="email"
        />

        {/* Error */}
        {error && (
          <div style={{ fontSize: 12, color: 'var(--err)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          style={{
            marginTop: 4,
            padding: 16,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--acc), #00b894)',
            color: '#0a0e1a',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 0.5,
            boxShadow: '0 4px 24px rgba(0,212,170,0.3)',
          }}
        >
          Start Session →
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
          Your session is saved locally on this device.
        </p>
      </div>
    </div>
  );
}