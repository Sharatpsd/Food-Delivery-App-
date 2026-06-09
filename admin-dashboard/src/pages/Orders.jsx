// Orders.jsx — drop-in replacement

import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    icon: '⏳', pill: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
  accepted:   { label: 'Accepted',   icon: '👍', pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  cooking:    { label: 'Cooking',    icon: '👨‍🍳', pill: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
  on_the_way: { label: 'On the way', icon: '🛵', pill: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
  delivered:  { label: 'Delivered',  icon: '✅', pill: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  cancelled:  { label: 'Cancelled',  icon: '❌', pill: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
};

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, icon: '•', pill: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function SummaryCard({ icon, label, value, accent }) {
  const accentMap = {
    blue:   'border-l-4 border-l-blue-500',
    yellow: 'border-l-4 border-l-yellow-400',
    green:  'border-l-4 border-l-green-500',
    red:    'border-l-4 border-l-red-400',
  };
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-4 ${accentMap[accent]}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1">
        <span>{icon}</span>{label}
      </p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value ?? '—'}</p>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getOrders({ status: statusFilter || undefined });
      setOrders(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await adminAPI.getOrderSummary();
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fmt = (n) =>
    n != null ? '৳' + Number(n).toLocaleString('en-IN') : '৳—';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
              📋
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Orders Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {orders.length} order{orders.length !== 1 ? 's' : ''} {statusFilter ? `· filtered by "${STATUS_CONFIG[statusFilter]?.label || statusFilter}"` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { fetchOrders(); fetchSummary(); }}
            className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SummaryCard icon="📦" label="Total orders" value={summary.total}     accent="blue" />
            <SummaryCard icon="⏳" label="Pending"      value={summary.pending}   accent="yellow" />
            <SummaryCard icon="✅" label="Completed"    value={summary.completed} accent="green" />
            <SummaryCard icon="❌" label="Cancelled"    value={summary.cancelled} accent="red" />
          </div>
        )}

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-1">
            Filter
          </span>
          {[{ value: '', label: 'All' }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {value ? `${STATUS_CONFIG[value]?.icon} ` : ''}{label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading orders...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button onClick={fetchOrders} className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors">
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">No orders found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {statusFilter ? `No orders with status "${STATUS_CONFIG[statusFilter]?.label}".` : 'No orders yet.'}
            </p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                    {['Order ID', 'Customer', 'Restaurant', 'Total', 'Status', 'Delivery by', 'Date'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white leading-tight">{order.customer_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.customer_email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{order.restaurant_name}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{fmt(order.total)}</td>
                      <td className="px-4 py-3"><StatusPill status={order.status} /></td>
                      <td className="px-4 py-3">
                        {order.delivery_boy_name ? (
                          <span className="text-gray-700 dark:text-gray-300">{order.delivery_boy_name}</span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600 dark:text-gray-300">{orders.length}</span> order{orders.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-400">
                Total value:{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {fmt(orders.reduce((sum, o) => sum + Number(o.total || 0), 0))}
                </span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}