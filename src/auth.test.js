import { describe, it, expect, vi } from 'vitest';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signIn } from './auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('./firebase', () => ({
  app: {},
  auth: {},
  db: {},
  storage: {},
}));

describe('signIn', () => {
  it('should call signInWithEmailAndPassword with correct arguments', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: { email } });

    await signIn(email, password);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
  });

  it('should return the result of signInWithEmailAndPassword', async () => {
    const mockUserCredential = { user: { uid: '123' } };
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);

    const result = await signIn('test@example.com', 'password123');

    expect(result).toBe(mockUserCredential);
  });

  it('should throw an error if signInWithEmailAndPassword fails', async () => {
    const error = new Error('Auth failed');
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(error);

    await expect(signIn('test@example.com', 'password123')).rejects.toThrow('Auth failed');
  });
});
