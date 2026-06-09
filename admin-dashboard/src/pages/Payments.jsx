// Payments.jsx — drop-in replacement

import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: '⏳', pill: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
  initiated: { label: 'Initiated', icon: '🔄', pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  completed: { label: 'Completed', icon: '✅', pill: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  failed:    { label: 'Failed',    icon: '❌', pill: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  cancelled: { label: 'Cancelled', icon: '🚫', pill: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
};

const METHOD_CONFIG = {
  bkash: { label: 'bKash',            color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',     icon: '💳' },
  nagad: { label: 'Nagad',            color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', icon: '💳' },
  card:  { label: 'Card',             color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',     icon: '💳' },
  cod:   { label: 'Cash on Delivery', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: '💵' },
};

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, icon: '•', pill: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function MethodBadge({ method }) {
  const cfg = METHOD_CONFIG[method?.toLowerCase()] || { label: method?.toUpperCase(), color: 'bg-gray-100 text-gray-600', icon: '💳' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function Payments() {
  const [payments, setPayments]       = useState([]);
  const [methodFilter, setMethodFilter] = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => { fetchPayments(); }, [methodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = methodFilter
        ? await adminAPI.getPaymentsByMethod(methodFilter)
        : await adminAPI.getPayments();
      setPayments(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
    n != null ? '৳' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '৳—';

  const totalAmount    = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const completedCount = payments.filter((p) => p.status === 'completed').length;
  const failedCount    = payments.filter((p) => p.status === 'failed').length;
  const completedAmt   = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
              💰
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Payments Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {payments.length} transaction{payments.length !== 1 ? 's' : ''}
                {methodFilter ? ` · ${METHOD_CONFIG[methodFilter]?.label || methodFilter}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={fetchPayments}
            className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Summary cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-blue-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">💳 Total transactions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{payments.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-orange-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">💰 Total amount</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{fmt(totalAmount)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-green-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">✅ Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedCount}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">{fmt(completedAmt)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-red-400">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">❌ Failed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{failedCount}</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-1">
            Method
          </span>
          {[{ value: '', label: 'All', icon: '🗂️' }, ...Object.entries(METHOD_CONFIG).map(([v, c]) => ({ value: v, label: c.label, icon: c.icon }))].map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setMethodFilter(value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                methodFilter === value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading payments...</p>
            </div>
          </div>

        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button onClick={fetchPayments} className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors">
              Retry
            </button>
          </div>

        ) : payments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
            <div className="text-5xl mb-4">💸</div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">No payments found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {methodFilter ? `No payments via ${METHOD_CONFIG[methodFilter]?.label}.` : 'No payment records yet.'}
            </p>
          </div>

        ) : (
          /* Table */
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                    {['Payment ID', 'Order ID', 'Customer', 'Method', 'Amount', 'Status', 'Transaction ID', 'Date'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{payment.id}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{payment.order_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{payment.customer_name}</td>
                      <td className="px-4 py-3"><MethodBadge method={payment.method} /></td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{fmt(payment.amount)}</td>
                      <td className="px-4 py-3"><StatusPill status={payment.status} /></td>
                      <td className="px-4 py-3">
                        {payment.transaction_id ? (
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {payment.transaction_id}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(payment.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600 dark:text-gray-300">{payments.length}</span> transaction{payments.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-400">
                Total:{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">{fmt(totalAmount)}</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}