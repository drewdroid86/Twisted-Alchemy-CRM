import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, limit, startAfter } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

const createCRUD = (collectionName) => {
  const colRef = collection(db, collectionName);

  return {
    getAll: async (options = {}) => {
      const { limitCount = 100, startAfterDoc } = options || {};
      let q = colRef;
      const constraints = [];

      if (limitCount) {
        constraints.push(limit(limitCount));
      }

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      if (constraints.length > 0) {
        q = query(colRef, ...constraints);
      }

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Attach lastVisible snapshot as a non-enumerable property to avoid breaking existing array usage
      Object.defineProperty(data, 'lastVisible', {
        value: snap.docs[snap.docs.length - 1] || null,
        enumerable: false,
        configurable: true,
        writable: true
      });

      return data;
    },
    getById: async (id) => {
      const docSnap = await getDoc(doc(db, collectionName, id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    create: async (data) => {
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    },
    update: async (id, data) => {
      await updateDoc(doc(db, collectionName, id), data);
    },
    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    }
  };
};

// Exporting the ready-to-use CRUD functions for your 4 main collections
export const projectsDb = createCRUD("projects");
export const inventoryDb = createCRUD("inventory");
export const expensesDb = createCRUD("expenses");
export const customersDb = createCRUD("customers");