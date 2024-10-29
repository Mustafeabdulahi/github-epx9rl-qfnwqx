import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, History, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Loan Manager</h2>
        <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
      </div>
      
      <nav className="mt-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" />
          Customers
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <History className="w-5 h-5 mr-3" />
          Transactions
        </NavLink>
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={logout}
          className="flex items-center text-gray-700 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}