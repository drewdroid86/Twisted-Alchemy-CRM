import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Dashboard.css'; // Reusing some dashboard styles
import '../components/Login.css'; // Reusing some login styles for buttons
import '../components/Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'customers'));
        const customersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(customersData);
      } catch (err) {
        setError('Failed to load customers.' + err.message);
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteDoc(doc(db, 'customers', id));
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (err) {
        setError('Failed to delete customer.' + err.message);
        console.error("Error deleting customer:", err);
      }
    }
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading customers...</p></div>;
  }

  if (error) {
    return <div className="dashboard-container"><p className="error-message" role="alert">{error}</p></div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Customers</h1>
      <Link to="/customers/new" className="form-button-success">Add New Customer</Link>

      {customers.length === 0 ? (
        <p>No customers found. Add a new customer to get started!</p>
      ) : (
        <ul className="customer-list">
          {customers.map(customer => (
            <li key={customer.id} className="customer-item">
              <div className="customer-details">
                <h3>{customer.name}</h3>
                <p>Phone: {customer.phone}</p>
                <p>Email: {customer.email}</p>
                <p>Address: {customer.address}</p>
              </div>
              <div className="customer-actions">
                <button onClick={() => navigate(`/customers/edit/${customer.id}`)} className="form-button-primary">Edit</button>
                <button onClick={() => handleDelete(customer.id)} className="form-button-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Customers;