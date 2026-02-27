import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAccount } from './auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Mock firebase/auth
vi.mock('firebase/auth', () => {
  const mockAuth = { name: 'mockAuth' };
  return {
    getAuth: vi.fn(() => mockAuth),
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
  };
});

// Mock ./firebase
vi.mock('./firebase', () => ({
  app: {},
}));

describe('auth.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should call createUserWithEmailAndPassword with correct arguments', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      createUserWithEmailAndPassword.mockResolvedValue({
        user: { email: email }
      });

      const result = await createAccount(email, password);

      const mockAuth = { name: 'mockAuth' };
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.objectContaining(mockAuth),
        email,
        password
      );
      expect(result.user.email).toBe(email);
    });

    it('should throw an error if createUserWithEmailAndPassword fails', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const errorMessage = 'Firebase: Error (auth/email-already-in-use).';

      createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

      await expect(createAccount(email, password)).rejects.toThrow(errorMessage);
    });

    it('should handle weak password error', async () => {
      const email = 'test@example.com';
      const password = '123';
      const errorMessage = 'Firebase: Password should be at least 6 characters (auth/weak-password).';

      createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

      await expect(createAccount(email, password)).rejects.toThrow(errorMessage);
    });
  });
});
