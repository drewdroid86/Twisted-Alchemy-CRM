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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
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

  it('shows alert on Sign In failure', async () => {
    const user = userEvent.setup();
    signIn.mockRejectedValueOnce(new Error('Auth failed'));
    render(<Login />);

    await user.type(screen.getByLabelText('email'), 'test@example.com');
    await user.type(screen.getByLabelText('password'), 'wrong');
    fireEvent.submit(screen.getByTestId('signin-form'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error signing in. Please check your credentials.');
    });
  });

  it('shows alert on Sign Up failure', async () => {
    const user = userEvent.setup();
    createAccount.mockRejectedValueOnce(new Error('Creation failed'));
    render(<Login />);

    fireEvent.click(screen.getByTestId('switch-to-signup'));
    await user.type(screen.getByLabelText('email'), 'new@example.com');
    await user.type(screen.getByLabelText('password'), 'newpassword');
    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error creating account. Please try again.');
    });
  });
});
