import { describe, it, expect, vi } from 'vitest';
import { customersDb } from './db';

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

// Mock Firebase App
vi.mock('./firebase', () => ({
  app: {},
}));

describe('Database Validation', () => {
  describe('customersDb', () => {
    it('should throw an error when creating a customer with invalid email', async () => {
      const invalidData = { name: 'John Doe', email: 'invalid-email' };
      await expect(customersDb.create(invalidData)).rejects.toThrow();
    });

    it('should throw an error when creating a customer with missing name', async () => {
      const invalidData = { email: 'john@example.com' };
      await expect(customersDb.create(invalidData)).rejects.toThrow();
    });

    it('should throw an error when updating a customer with invalid data', async () => {
      const invalidData = { name: '', email: 'john@example.com' };
      await expect(customersDb.update('some-id', invalidData)).rejects.toThrow();
    });

    it('should allow partial updates for customers', async () => {
      const partialData = { name: 'John Updated' };
      // Should not throw ZodError
      try {
        await customersDb.update('some-id', partialData);
      } catch (error) {
        expect(error.name).not.toBe('ZodError');
      }
    });

    it('should not throw an error with valid customer data (validation only)', async () => {
      // Note: This will still fail on the actual Firestore call if not fully mocked,
      // but we want to check that it PASSES the Zod validation step.
      const validData = { name: 'John Doe', email: 'john@example.com' };

      // We expect it to reach the addDoc call if validation passes
      try {
        await customersDb.create(validData);
      } catch (error) {
        // If it's a Zod error, the test should fail
        expect(error.name).not.toBe('ZodError');
      }
    });
  });
});
