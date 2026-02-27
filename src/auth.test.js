import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('./firebase', () => ({
  app: {},
}));

import { onAuthChange, signIn, createAccount, logOut } from './auth';

describe('auth logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('onAuthChange should call onAuthStateChanged', () => {
    const callback = vi.fn();
    onAuthChange(callback);
    expect(onAuthStateChanged).toHaveBeenCalledWith(expect.any(Object), callback);
  });

  it('signIn should call signInWithEmailAndPassword', () => {
    const email = 'test@example.com';
    const password = 'password123';
    signIn(email, password);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), email, password);
  });

  it('createAccount should call createUserWithEmailAndPassword', () => {
    const email = 'new@example.com';
    const password = 'password123';
    createAccount(email, password);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), email, password);
  });

  it('logOut should call signOut', () => {
    logOut();
    expect(signOut).toHaveBeenCalledWith(expect.any(Object));
  });

  it('signIn should propagate error when it fails', async () => {
    const error = new Error('Auth failed');
    signInWithEmailAndPassword.mockRejectedValueOnce(error);
    await expect(signIn('test@example.com', 'wrong')).rejects.toThrow('Auth failed');
  });

  it('createAccount should propagate error when it fails', async () => {
    const error = new Error('Creation failed');
    createUserWithEmailAndPassword.mockRejectedValueOnce(error);
    await expect(createAccount('new@example.com', 'pass')).rejects.toThrow('Creation failed');
  });

  it('logOut should propagate error when it fails', async () => {
    const error = new Error('Logout failed');
    signOut.mockRejectedValueOnce(error);
    await expect(logOut()).rejects.toThrow('Logout failed');
  });
});
