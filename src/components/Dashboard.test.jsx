import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  it('renders the dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Customer Relationship Management')).toBeInTheDocument();
  });

  it('renders a table with Name and Email headers', () => {
    render(<Dashboard />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders all mock customers correctly', () => {
    render(<Dashboard />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();

    expect(screen.getByText('Sam Wilson')).toBeInTheDocument();
    expect(screen.getByText('sam.wilson@example.com')).toBeInTheDocument();
  });

  it('renders the correct number of customer rows', () => {
    render(<Dashboard />);
    // There are 3 customers, plus 1 header row = 4 rows in total, but we can check specifically for body rows
    const rows = screen.getAllByRole('row');
    // Header row + 3 customer rows = 4
    expect(rows).toHaveLength(4);
  });
});
