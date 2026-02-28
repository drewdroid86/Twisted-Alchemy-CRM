import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDocs, getDoc, addDoc, updateDoc, deleteDoc, collection, doc, query, limit, startAfter } from 'firebase/firestore';
import { projectsDb } from './db';

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ name: 'mockDb' })),
  collection: vi.fn((db, name) => ({ db, name })),
  doc: vi.fn((db, name, id) => ({ db, name, id })),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn((ref, ...constraints) => ({ ref, constraints })),
  limit: vi.fn((count) => ({ type: 'limit', count })),
  startAfter: vi.fn((doc) => ({ type: 'startAfter', doc })),
}));

vi.mock('./firebase', () => ({
  app: { name: 'mockApp' },
}));

describe('db.js createCRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call getDocs with default limit of 100', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Project 1' }) },
        { id: '2', data: () => ({ name: 'Project 2' }) },
      ];
      getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await projectsDb.getAll();

      expect(limit).toHaveBeenCalledWith(100);
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', name: 'Project 1' });
      expect(result.lastVisible).toEqual(mockDocs[1]);
    });

    it('should call getDocs with custom limit and startAfterDoc', async () => {
      const mockDocs = [{ id: '3', data: () => ({ name: 'Project 3' }) }];
      getDocs.mockResolvedValue({ docs: mockDocs });

      const startAfterDoc = { id: '2' };
      const result = await projectsDb.getAll({ limitCount: 10, startAfterDoc });

      expect(limit).toHaveBeenCalledWith(10);
      expect(startAfter).toHaveBeenCalledWith(startAfterDoc);
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
      expect(result[0]).toEqual({ id: '3', name: 'Project 3' });
      expect(result.lastVisible).toEqual(mockDocs[0]);
    });

    it('should handle empty results', async () => {
      getDocs.mockResolvedValue({ docs: [] });
      const result = await projectsDb.getAll();
      expect(result).toHaveLength(0);
      expect(result.lastVisible).toBeNull();
    });
  });

  describe('getById', () => {
    it('should return doc data when doc exists', async () => {
      const mockDoc = { id: '1', exists: () => true, data: () => ({ name: 'Project 1' }) };
      getDoc.mockResolvedValue(mockDoc);

      const result = await projectsDb.getById('1');

      expect(doc).toHaveBeenCalledWith(expect.objectContaining({ name: 'mockDb' }), 'projects', '1');
      expect(getDoc).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', name: 'Project 1' });
    });

    it('should return null when doc does not exist', async () => {
      const mockDoc = { exists: () => false };
      getDoc.mockResolvedValue(mockDoc);

      const result = await projectsDb.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should call addDoc and return new doc id', async () => {
      const mockDocRef = { id: 'new-id' };
      addDoc.mockResolvedValue(mockDocRef);

      const data = { name: 'New Project' };
      const result = await projectsDb.create(data);

      expect(addDoc).toHaveBeenCalledWith(expect.objectContaining({ name: 'projects' }), data);
      expect(result).toBe('new-id');
    });
  });

  describe('update', () => {
    it('should call updateDoc with correct arguments', async () => {
      const data = { name: 'Updated Project' };

      await projectsDb.update('1', data);

      expect(doc).toHaveBeenCalledWith(expect.objectContaining({ name: 'mockDb' }), 'projects', '1');
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call deleteDoc with correct arguments', async () => {
      await projectsDb.delete('1');

      expect(doc).toHaveBeenCalledWith(expect.objectContaining({ name: 'mockDb' }), 'projects', '1');
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
