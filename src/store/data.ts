import { create } from 'zustand';
import { Customer, Transaction } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import toast from 'react-hot-toast';

interface DataState {
  customers: Customer[];
  transactions: Transaction[];
  isLoading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalLoaned' | 'totalPaid' | 'currentBalance' | 'createdAt'>) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerTransactions: (customerId: string) => Transaction[];
  loadCustomers: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  customers: [],
  transactions: [],
  isLoading: false,

  loadCustomers: async () => {
    set({ isLoading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'customers'));
      const customers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      set({ customers, isLoading: false });
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
      set({ isLoading: false });
    }
  },

  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      set({ transactions, isLoading: false });
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
      set({ isLoading: false });
    }
  },

  addCustomer: async (customerData) => {
    try {
      const newCustomer = {
        ...customerData,
        totalLoaned: 0,
        totalPaid: 0,
        currentBalance: 0,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'customers'), newCustomer);
      const customer = {
        id: docRef.id,
        ...newCustomer,
        createdAt: new Date().toISOString() // Convert timestamp for local state
      };
      
      set(state => ({
        customers: [...state.customers, customer]
      }));
      
      toast.success('Customer added successfully');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    }
  },

  addTransaction: async (transactionData) => {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      const transaction = {
        id: docRef.id,
        ...transactionData
      };

      // Update customer balances in Firestore
      const customerRef = doc(db, 'customers', transactionData.customerId);
      const customer = get().customers.find(c => c.id === transactionData.customerId);
      
      if (customer) {
        const amount = transactionData.amount;
        const updates = transactionData.type === 'loan'
          ? {
              totalLoaned: customer.totalLoaned + amount,
              currentBalance: customer.currentBalance + amount,
            }
          : {
              totalPaid: customer.totalPaid + amount,
              currentBalance: customer.currentBalance - amount,
            };

        await updateDoc(customerRef, updates);

        // Update local state
        set(state => ({
          transactions: [...state.transactions, transaction],
          customers: state.customers.map(c =>
            c.id === customer.id
              ? { ...c, ...updates }
              : c
          )
        }));

        toast.success('Transaction added successfully');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  },

  getCustomerById: (id) => {
    return get().customers.find(c => c.id === id);
  },

  getCustomerTransactions: (customerId) => {
    return get().transactions.filter(t => t.customerId === customerId);
  },
}));