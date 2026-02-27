import React, { useState, useEffect } from 'react';
import { onAuthChange, signIn, createAccount, logOut } from './auth';

const getSafeErrorMessage = (error) => {
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
      alert(getSafeErrorMessage(error));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createAccount(email, password);
    } catch (error) {
      alert(getSafeErrorMessage(error));
    }
  };

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
    },
    spinner: {
      border: '4px solid #f0f1f3',
      borderTop: '4px solid #e8a020',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    },
    welcomeContainer: {
      textAlign: 'center',
    },
    welcomeText: {
      marginBottom: '1rem',
      fontSize: '1.5rem',
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        {isSigningUp ? (
          <form style={styles.form} onSubmit={handleSignUp}>
            <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Create Account</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Create Account</button>
            <p style={styles.secondaryButton} onClick={() => setIsSigningUp(false)}>
              Already have an account? Sign In
            </p>
          </form>
        ) : (
          <form style={styles.form} onSubmit={handleSignIn}>
            <h2 style={{ textAlign: 'center', color: '#e8a020' }}>Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Sign In</button>
            <p style={styles.secondaryButton} onClick={() => setIsSigningUp(true)}>
              Don't have an account? Create one
            </p>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcomeContainer}>
        <h1 style={styles.welcomeText}>Welcome, {user.email}</h1>
        <button onClick={logOut} style={styles.button}>Sign Out</button>
      </div>
    </div>
  );
};

export default App;
