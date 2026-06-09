// Reports.jsx — drop-in replacement

import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const PERIODS = [
  { value: 7,   label: 'Last 7 days' },
  { value: 30,  label: 'Last 30 days' },
  { value: 90,  label: 'Last 90 days' },
  { value: 365, label: 'Last year' },
];

function MiniSparkline({ data, color = '#f97316' }) {
  if (!data || data.length < 2) return null;
  const vals = data.map((r) => Number(r.total_revenue || 0));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [days, setDays]       = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [totals, setTotals]   = useState({ orders: 0, revenue: 0 });

  useEffect(() => { fetchReports(); }, [days]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getRevenueReport(days);
      const data = response.data;
      setReports(data);
      setTotals({
        orders:  data.reduce((s, r) => s + (r.total_orders   || 0), 0),
        revenue: data.reduce((s, r) => s + Number(r.total_revenue || 0), 0),
      });
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
    n != null
      ? '৳' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '৳—';

  const avgOrder  = totals.orders > 0 ? totals.revenue / totals.orders : 0;
  const maxRevDay = reports.length ? Math.max(...reports.map((r) => Number(r.total_revenue || 0))) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
              📈
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Report</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {PERIODS.find((p) => p.value === days)?.label} · {reports.length} data points
              </p>
            </div>
          </div>
          <button
            onClick={fetchReports}
            className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Period filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-1">
            Period
          </span>
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setDays(value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                days === value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-blue-500">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">📦 Total orders</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totals.orders.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-green-500">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">💰 Total revenue</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{fmt(totals.revenue)}</p>
            <MiniSparkline data={reports} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-purple-500">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🧾 Avg order value</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{fmt(avgOrder)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 border-l-yellow-400">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">📅 Days analyzed</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{days}</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading report...</p>
            </div>
          </div>

        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button onClick={fetchReports} className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors">
              Retry
            </button>
          </div>

        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">No data available</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">No revenue data for the selected period.</p>
          </div>

        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                    {['Date', 'Orders', 'Revenue', 'Completed', 'Avg order value', 'Revenue bar'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {reports.map((report, idx) => {
                    const revNum  = Number(report.total_revenue || 0);
                    const barPct  = maxRevDay > 0 ? Math.round((revNum / maxRevDay) * 100) : 0;
                    const isTop   = revNum === maxRevDay && maxRevDay > 0;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {new Date(report.date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{report.total_orders}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          <span className={isTop ? 'text-orange-500' : ''}>{fmt(revNum)}</span>
                          {isTop && <span className="ml-1 text-[10px] text-orange-400">▲ top</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{report.completed_orders}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fmt(report.average_order_value)}</td>
                        <td className="px-4 py-3 w-32">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-orange-400"
                                style={{ width: `${barPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400 w-6 text-right">{barPct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {reports.length} day{reports.length !== 1 ? 's' : ''} of data
              </p>
              <p className="text-xs text-gray-400">
                Total revenue:{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">{fmt(totals.revenue)}</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}