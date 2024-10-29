import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import { useDataStore } from '../store/data';

export default function CustomerDetail() {
  const { id } = useParams();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { getCustomerById, getCustomerTransactions, addTransaction } = useDataStore();

  const customer = getCustomerById(id!);
  const transactions = getCustomerTransactions(id!);

  if (!customer) {
    return <Navigate to="/customers" replace />;
  }

  const handleAddTransaction = (data: any) => {
    addTransaction({ ...data, customerId: customer.id });
    setShowTransactionForm(false);
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link
          to="/customers"
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="mt-1 text-gray-900">{customer.firstName}</p>
              </div>
              {customer.middleName && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Middle Name</label>
                  <p className="mt-1 text-gray-900">{customer.middleName}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="mt-1 text-gray-900">{customer.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="mt-1 text-gray-900">{customer.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="mt-1 text-gray-900">{customer.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Loan Summary</h2>
              <button 
                onClick={() => setShowTransactionForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Transaction
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Current Balance</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${customer.currentBalance.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Loaned</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${customer.totalLoaned.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${customer.totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'loan'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSubmit={handleAddTransaction}
          customers={[customer]}
          preselectedCustomerId={customer.id}
        />
      )}
    </div>
  );
}