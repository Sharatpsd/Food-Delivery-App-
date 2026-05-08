import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [methodFilter, setMethodFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [methodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      if (methodFilter) {
        const response = await adminAPI.getPaymentsByMethod(methodFilter);
        setPayments(response.data);
      } else {
        const response = await adminAPI.getPayments();
        setPayments(response.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    initiated: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Payments Management</h1>

      <div className="mb-6">
        <label className="mr-4">Filter by Method:</label>
        <select 
          value={methodFilter} 
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Methods</option>
          <option value="bkash">bKash</option>
          <option value="nagad">Nagad</option>
          <option value="card">Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Payment ID</th>
                <th className="border p-3 text-left">Order ID</th>
                <th className="border p-3 text-left">Customer</th>
                <th className="border p-3 text-left">Method</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Transaction ID</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border hover:bg-gray-50">
                  <td className="p-3">#{payment.id}</td>
                  <td className="p-3">#{payment.order_id}</td>
                  <td className="p-3">{payment.customer_name}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                      {payment.method.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">৳{payment.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${statusColors[payment.status] || 'bg-gray-100'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-mono">{payment.transaction_id || 'N/A'}</td>
                  <td className="p-3 text-sm">{new Date(payment.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
