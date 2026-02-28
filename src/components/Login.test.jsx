import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { signIn, createAccount } from '../auth';
import userEvent from '@testing-library/user-event';

// Mock the auth module
vi.mock('../auth', () => ({
  signIn: vi.fn(),
  createAccount: vi.fn(),
}));

// Mock the logger module
vi.mock('../logger', () => ({
  default: {
    error: vi.fn(),
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Sign In form by default', () => {
    render(<Login />);
    expect(screen.getByTestId('signin-form')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('switches to Sign Up form when clicking the link', async () => {
    render(<Login />);
    const switchLink = screen.getByTestId('switch-to-signup');
    fireEvent.click(switchLink);
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
  });

  it('switches back to Sign In form when clicking the link on Sign Up form', async () => {
    render(<Login />);
    fireEvent.click(screen.getByTestId('switch-to-signup'));
    fireEvent.click(screen.getByTestId('switch-to-signin'));
    expect(screen.getByTestId('signin-form')).toBeInTheDocument();
  });

  it('updates email and password inputs', async () => {
    const user = userEvent.setup();
    render(<Login />);
    const emailInput = screen.getByLabelText('email');
    const passwordInput = screen.getByLabelText('password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls signIn with correct credentials on Sign In form submission', async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValueOnce({});
    render(<Login />);

    await user.type(screen.getByLabelText('email'), 'test@example.com');
    await user.type(screen.getByLabelText('password'), 'password123');
    fireEvent.submit(screen.getByTestId('signin-form'));

    expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('calls createAccount with correct credentials on Sign Up form submission', async () => {
    const user = userEvent.setup();
    createAccount.mockResolvedValueOnce({});
    render(<Login />);

    fireEvent.click(screen.getByTestId('switch-to-signup'));
    await user.type(screen.getByLabelText('email'), 'new@example.com');
    await user.type(screen.getByLabelText('password'), 'newpassword');
    fireEvent.submit(screen.getByTestId('signup-form'));

    expect(createAccount).toHaveBeenCalledWith('new@example.com', 'newpassword');
  });

  it('shows error message on Sign In failure', async () => {
    const user = userEvent.setup();
    signIn.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    render(<Login />);

    await user.type(screen.getByLabelText('email'), 'test@example.com');
    await user.type(screen.getByLabelText('password'), 'wrongpassword');
    fireEvent.submit(screen.getByTestId('signin-form'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });

  it('shows error message on Sign Up failure', async () => {
    const user = userEvent.setup();
    createAccount.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
    render(<Login />);

    fireEvent.click(screen.getByTestId('switch-to-signup'));
    await user.type(screen.getByLabelText('email'), 'new@example.com');
    await user.type(screen.getByLabelText('password'), 'newpassword');
    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => {
      expect(screen.getByText('An account with this email already exists.')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText('email'), 'invalid-email');
    await user.type(screen.getByLabelText('password'), 'password123');
    fireEvent.submit(screen.getByTestId('signin-form'));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText('email'), 'test@example.com');
    await user.type(screen.getByLabelText('password'), '12345');
    fireEvent.submit(screen.getByTestId('signin-form'));

    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });
});
