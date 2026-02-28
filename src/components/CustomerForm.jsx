import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import './Login.css'; // Reusing some login styles for form elements and buttons
import './Customers.css';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get customer ID from URL for editing

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, 'customers', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name);
            setPhone(data.phone);
            setEmail(data.email);
            setAddress(data.address);
          } else {
            setError("Customer not found.");
          }
        } catch (err) {
          setError('Failed to load customer data.' + err.message);
          console.error("Error fetching customer for edit:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const customerData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim()
    };

    try {
      if (id) {
        // Update existing customer
        await updateDoc(doc(db, 'customers', id), customerData);
        alert('Customer updated successfully!');
      } else {
        // Add new customer
        await addDoc(collection(db, 'customers'), customerData);
        alert('Customer added successfully!');
      }
      navigate('/customers');
    } catch (err) {
      setError('Failed to save customer.' + err.message);
      console.error("Error saving customer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading customer form...</p></div>;
  }

  return (
    <div className="login-container">
      <h1 className="login-title">{id ? 'Edit Customer' : 'Add New Customer'}</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className="form-button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (id ? 'Update Customer' : 'Add Customer')}
        </button>
        <button type="button" onClick={() => navigate('/customers')} className="form-button-secondary" disabled={isSubmitting}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;