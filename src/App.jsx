import React, { useState, useEffect } from 'react';
import { onAuthChange, logOut } from './auth';
import Login from './components/Login';

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

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
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
