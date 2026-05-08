import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ orders: 0, revenue: 0 });

  useEffect(() => {
    fetchReports();
  }, [days]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRevenueReport(days);
      setReports(response.data);
      
      // Calculate totals
      const totalOrders = response.data.reduce((sum, r) => sum + r.total_orders, 0);
      const totalRevenue = response.data.reduce((sum, r) => sum + r.total_revenue, 0);
      setTotals({ orders: totalOrders, revenue: totalRevenue });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Revenue Report</h1>

      <div className="mb-6 flex gap-4 items-center">
        <label>Time Period:</label>
        <select 
          value={days} 
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={365}>Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">{totals.orders}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold">৳{totals.revenue.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-gray-600">Average Order</p>
          <p className="text-2xl font-bold">
            ৳{totals.orders > 0 ? (totals.revenue / totals.orders).toFixed(2) : 0}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <p className="text-gray-600">Days Analyzed</p>
          <p className="text-2xl font-bold">{days}</p>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Orders</th>
                <th className="border p-3 text-left">Revenue</th>
                <th className="border p-3 text-left">Completed</th>
                <th className="border p-3 text-left">Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <tr key={idx} className="border hover:bg-gray-50">
                  <td className="p-3 font-semibold">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="p-3">{report.total_orders}</td>
                  <td className="p-3 font-semibold">৳{report.total_revenue.toFixed(2)}</td>
                  <td className="p-3">{report.completed_orders}</td>
                  <td className="p-3">৳{report.average_order_value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-center text-gray-600">
        <p>Showing report for last {days} days</p>
      </div>
    </div>
  );
}
