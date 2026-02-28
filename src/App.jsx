import React, { useState, useEffect } from 'react';
import { onAuthChange, signIn, createAccount, logOut } from './auth';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please check your credentials.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createAccount(email, password);
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-container">
        {isSigningUp ? (
          <form className="auth-form" onSubmit={handleSignUp}>
            <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Create Account</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <button type="submit" className="primary-button">Create Account</button>
            <p className="secondary-button" onClick={() => setIsSigningUp(false)}>
              Already have an account? Sign In
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignIn}>
            <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <button type="submit" className="primary-button">Sign In</button>
            <p className="secondary-button" onClick={() => setIsSigningUp(true)}>
              Don't have an account? Create one
            </p>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="welcome-container">
        <h1 className="welcome-text">Welcome, {user.email}</h1>
        <Dashboard />
        <button onClick={logOut} className="primary-button">Sign Out</button>
      </div>
    </div>
  );
};

export default App;
