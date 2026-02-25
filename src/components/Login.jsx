import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setError(null);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
  };

  return (
    <div className="login-container">
      <h2>{isLoginMode ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleAuthAction}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLoginMode ? 'Login' : 'Create Account'}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={toggleMode} className="toggle-button">
          {isLoginMode ? 'Create Account' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};

export default Login;