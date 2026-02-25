import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { onAuthChange } from './auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;