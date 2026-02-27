import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "./firebase";
import { z } from "zod";

const db = getFirestore(app);

// Zod schemas for validation
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
}).strict();

export const projectSchema = z.record(z.any());
export const inventorySchema = z.record(z.any());
export const expenseSchema = z.record(z.any());

const createCRUD = (collectionName, schema) => {
  const colRef = collection(db, collectionName);

  return {
    getAll: async () => {
      const snap = await getDocs(colRef);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    getById: async (id) => {
      const docSnap = await getDoc(doc(db, collectionName, id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    create: async (data) => {
      if (schema) schema.parse(data);
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    },
    update: async (id, data) => {
      if (schema) {
        if (schema instanceof z.ZodObject) {
          schema.partial().parse(data);
        } else {
          schema.parse(data);
        }
      }
      await updateDoc(doc(db, collectionName, id), data);
    },
    delete: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    }
  };
};

// Exporting the ready-to-use CRUD functions for your 4 main collections
export const projectsDb = createCRUD("projects", projectSchema);
export const inventoryDb = createCRUD("inventory", inventorySchema);
export const expensesDb = createCRUD("expenses", expenseSchema);
export const customersDb = createCRUD("customers", customerSchema);
