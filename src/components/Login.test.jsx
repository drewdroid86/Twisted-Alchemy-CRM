import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('toggles between login and create account modes', () => {
    render(<Login />);
    const toggleButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.click(toggleButton);
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i, type: 'submit' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('displays error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));
    getAuth.mockReturnValue({});

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays error message when account creation fails', async () => {
    const errorMessage = 'Email already in use';
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));
    getAuth.mockReturnValue({});

    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i })); // Switch to sign up mode

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i, type: 'submit' }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears error when switching modes', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Login failed'));
    getAuth.mockReturnValue({});

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });

  it('calls signInWithEmailAndPassword on login submit', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});
    getAuth.mockReturnValue({});

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
    });
  });
});
