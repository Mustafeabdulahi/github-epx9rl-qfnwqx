import React from 'react';
import { Users, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useDataStore } from '../store/data';

export default function Dashboard() {
  const { customers, transactions } = useDataStore();

  const stats = {
    totalCustomers: customers.length,
    totalLoaned: customers.reduce((sum, customer) => sum + customer.totalLoaned, 0),
    totalPaid: customers.reduce((sum, customer) => sum + customer.totalPaid, 0),
    outstandingBalance: customers.reduce((sum, customer) => sum + customer.currentBalance, 0),
  };

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(transaction => ({
      ...transaction,
      customerName: customers.find(c => c.id === transaction.customerId)?.name || 'Unknown'
    }));

  // Get upcoming payments (transactions with future dates)
  const upcomingPayments = transactions
    .filter(t => new Date(t.date) > new Date() && t.type === 'payment')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map(transaction => ({
      ...transaction,
      customerName: customers.find(c => c.id === transaction.customerId)?.name || 'Unknown'
    }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Loaned</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalLoaned.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ArrowUpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowDownCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.outstandingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                      transaction.type === 'loan'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-sm text-gray-500">No recent transactions</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Payments
          </h2>
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.customerName}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(payment.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${payment.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {upcomingPayments.length === 0 && (
              <p className="text-sm text-gray-500">No upcoming payments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}