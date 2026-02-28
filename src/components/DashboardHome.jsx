import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHome.css';

function DashboardHome() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Twisted Alchemy CRM Dashboard</h1>
      <nav className="dashboard-nav">
        <ul className="dashboard-nav-list">
          <li className="dashboard-nav-item">
            <Link to="/customers" className="dashboard-nav-link">Customers</Link>
          </li>
          <li className="dashboard-nav-item">
            <Link to="/orders" className="dashboard-nav-link">Orders</Link>
          </li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <p>Welcome to your CRM dashboard. Use the navigation to manage your customers and orders.</p>
      </div>
    </div>
  );
}

export default DashboardHome;