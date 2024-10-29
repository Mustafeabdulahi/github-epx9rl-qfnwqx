import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useDataStore } from '../store/data';
import Sidebar from './Sidebar';

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const { loadCustomers, loadTransactions } = useDataStore();

  useEffect(() => {
    if (user) {
      loadCustomers();
      loadTransactions();
    }
  }, [user, loadCustomers, loadTransactions]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}