import React, { useState } from 'react';
import { signIn, createAccount } from '../auth';
import logger from '../logger';
import './Login.css';

const getSafeErrorMessage = (error) => {
  if (!error.code) return 'An unexpected error occurred. Please try again.';
  switch (error.code) {
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateInputs()) return;
    try {
      await signIn(email, password);
    } catch (err) {
      logger.error('Error signing in:', err);
      setError(getSafeErrorMessage(err));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateInputs()) return;
    try {
      await createAccount(email, password);
    } catch (err) {
      logger.error('Error creating account:', err);
      setError(getSafeErrorMessage(err));
    }
  };

  return (
    <div className="login-container">
      {isSigningUp ? (
        <form className="login-form" onSubmit={handleSignUp} data-testid="signup-form">
          <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Create Account</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
            aria-label="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            aria-label="password"
          />
          <button type="submit" className="login-button">Create Account</button>
          {error && <p className="error-message" style={{ color: '#ff4d4d', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          <p className="secondary-button" onClick={() => { setIsSigningUp(false); setError(null); }} data-testid="switch-to-signin" style={{ cursor: 'pointer', textAlign: 'center', color: '#e8a020', marginTop: '1rem' }}>
            Already have an account? Sign In
          </p>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSignIn} data-testid="signin-form">
          <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
            aria-label="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            aria-label="password"
          />
          <button type="submit" className="login-button">Sign In</button>
          {error && <p className="error-message" style={{ color: '#ff4d4d', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          <p className="secondary-button" onClick={() => { setIsSigningUp(true); setError(null); }} data-testid="switch-to-signup" style={{ cursor: 'pointer', textAlign: 'center', color: '#e8a020', marginTop: '1rem' }}>
            Don't have an account? Create one
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
