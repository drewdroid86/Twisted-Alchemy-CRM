import React, { useState } from 'react';
import { signIn, createAccount } from '../auth';
import './Login.css';

const styles = {
  container: {
    backgroundColor: '#16181d',
    color: '#f0f1f3',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#212329',
    border: '1px solid #333',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#16181d',
    color: '#f0f1f3',
    fontSize: '1rem',
  },
  button: {
    padding: '0.8rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#e8a020',
    color: '#16181d',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#e8a020',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '1rem',
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

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

  return (
    <div style={styles.container}>
      {isSigningUp ? (
        <form style={styles.form} onSubmit={handleSignUp} data-testid="signup-form">
          <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Create Account</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
            aria-label="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            aria-label="password"
          />
          <button type="submit" style={styles.button}>Create Account</button>
          <p style={styles.secondaryButton} onClick={() => setIsSigningUp(false)} data-testid="switch-to-signin">
            Already have an account? Sign In
          </p>
        </form>
      ) : (
        <form style={styles.form} onSubmit={handleSignIn} data-testid="signin-form">
          <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
            aria-label="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            aria-label="password"
          />
          <button type="submit" style={styles.button}>Sign In</button>
          <p style={styles.secondaryButton} onClick={() => setIsSigningUp(true)} data-testid="switch-to-signup">
            Don't have an account? Create one
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
