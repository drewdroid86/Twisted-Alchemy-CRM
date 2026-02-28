import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import DashboardHome from './components/DashboardHome';
import Customers from './pages/Customers';
import CustomerForm from './components/CustomerForm';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="App"><p>Loading application...</p></div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <HomeRedirect /> : <Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <DashboardHome /> : <Login />} />
          <Route path="/customers" element={isAuthenticated ? <Customers /> : <Login />} />
          <Route path="/customers/new" element={isAuthenticated ? <CustomerForm /> : <Login />} />
          <Route path="/customers/edit/:id" element={isAuthenticated ? <CustomerForm /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);
  return null;
}

export default App;