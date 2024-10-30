export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface Customer {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  totalLoaned: number;
  totalPaid: number;
  currentBalance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: 'loan' | 'payment';
  amount: number;
  date: string;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}