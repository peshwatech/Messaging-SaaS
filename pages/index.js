// File Location: /pages/index.js

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebase'; // Importing auth from our firebase.js setup

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Successfully logged in! Redirecting...');
        // Redirect to the dashboard after a short delay to show the message
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000); // 1-second delay
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('Successfully signed up! Please log in.');
        setIsLogin(true); // Switch to login view after signup
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '24px', color: '#1c1e21' }}>WhatsApp SaaS</h1>
        <h2 style={{ marginBottom: '24px', color: '#606770', fontSize: '1.2rem' }}>{isLogin ? 'Log In' : 'Sign Up'}</h2>
        <form onSubmit={handleAuthAction}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            style={{ width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #dddfe2', fontSize: '1rem' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #dddfe2', fontSize: '1rem' }}
          />
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#1877f2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginTop: '12px' }}>{message}</p>}
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#1877f2', cursor: 'pointer', marginTop: '20px', fontSize: '0.9rem' }}>
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
        </button>
      </div>
    </div>
  );
}
