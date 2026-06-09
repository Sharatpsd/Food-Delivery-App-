// Restaurants.jsx — drop-in replacement

import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

function RestaurantAvatar({ name }) {
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  const colors = [
    'bg-orange-100 text-orange-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-pink-100 text-pink-700',
  ];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

// ── Reject Modal (replaces browser prompt()) ──────────────────────────────────
function RejectModal({ restaurant, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 w-full max-w-md shadow-xl">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Reject restaurant</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Rejecting <span className="font-medium text-gray-700 dark:text-gray-300">{restaurant?.name}</span>. Please provide a reason.
        </p>
        <textarea
          autoFocus
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Incomplete documentation, invalid address…"
          className="w-full text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex gap-2 mt-4 justify-end">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim() || loading}
            className="text-sm px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-900 text-white font-medium transition-colors flex items-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pending Card ──────────────────────────────────────────────────────────────
function PendingCard({ restaurant, onApprove, onReject, approvingId, rejectingId }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <RestaurantAvatar name={restaurant.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{restaurant.name}</h3>
              <span className="text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                Pending
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              📍 {restaurant.address}{restaurant.city ? `, ${restaurant.city}` : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              👤 {restaurant.owner_name}
              {restaurant.owner_email && (
                <span className="ml-1 text-gray-400">· {restaurant.owner_email}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onApprove(restaurant.id)}
            disabled={approvingId === restaurant.id}
            className="flex items-center gap-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-900 text-white px-3 py-2 rounded-xl transition-colors"
          >
            {approvingId === restaurant.id
              ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : '✅'} Approve
          </button>
          <button
            onClick={() => onReject(restaurant)}
            disabled={rejectingId === restaurant.id}
            className="flex items-center gap-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-900 text-white px-3 py-2 rounded-xl transition-colors"
          >
            {rejectingId === restaurant.id
              ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : '❌'} Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Active Card ───────────────────────────────────────────────────────────────
function ActiveCard({ restaurant, onToggle, togglingId }) {
  const isActive = restaurant.is_active;
  const fmt = (n) => n != null ? '৳' + Number(n).toLocaleString('en-IN') : '৳—';
  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 transition-colors ${
      isActive
        ? 'border-gray-100 dark:border-gray-700'
        : 'border-gray-100 dark:border-gray-700 opacity-60'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <RestaurantAvatar name={restaurant.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{restaurant.name}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {isActive ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              📍 {restaurant.address}{restaurant.city ? `, ${restaurant.city}` : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              👤 {restaurant.owner_name}
              {restaurant.owner_email && <span className="ml-1">· {restaurant.owner_email}</span>}
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                📦 <span className="font-medium text-gray-700 dark:text-gray-300">{restaurant.order_count ?? 0}</span> orders
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                💰 <span className="font-medium text-gray-700 dark:text-gray-300">{fmt(restaurant.total_revenue)}</span>
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggle(restaurant.id)}
          disabled={togglingId === restaurant.id}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-white transition-colors ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
              : 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
          }`}
        >
          {togglingId === restaurant.id
            ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : isActive ? '🔴' : '🟢'
          }
          {isActive ? 'Close' : 'Open'}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Restaurants() {
  const [activeTab, setActiveTab]     = useState('pending');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [togglingId, setTogglingId]   = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); // restaurant object for modal
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    activeTab === 'pending' ? fetchPendingRequests() : fetchRestaurants();
  }, [activeTab]);

  const fetchPendingRequests = async () => {
    try { setLoading(true); setError(null);
      const r = await adminAPI.getRestaurantRequests(); setRestaurants(r.data);
    } catch (e) { setError(e.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  const fetchRestaurants = async () => {
    try { setLoading(true); setError(null);
      const r = await adminAPI.getRestaurants(); setRestaurants(r.data);
    } catch (e) { setError(e.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      await adminAPI.approveRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      setApprovedCount((c) => c + 1);
    } catch (e) { console.error(e); }
    finally { setApprovingId(null); }
  };

  const handleReject = (restaurant) => setRejectTarget(restaurant);

  const confirmReject = async (reason) => {
    try {
      setRejectingId(rejectTarget.id);
      await adminAPI.rejectRestaurant(rejectTarget.id, reason);
      setRestaurants((prev) => prev.filter((r) => r.id !== rejectTarget.id));
      setRejectTarget(null);
    } catch (e) { console.error(e); }
    finally { setRejectingId(null); }
  };

  const handleToggle = async (id) => {
    try {
      setTogglingId(id);
      await adminAPI.toggleRestaurant(id);
      setRestaurants((prev) =>
        prev.map((r) => r.id === id ? { ...r, is_active: !r.is_active } : r)
      );
    } catch (e) { console.error(e); }
    finally { setTogglingId(null); }
  };

  const refresh = () => activeTab === 'pending' ? fetchPendingRequests() : fetchRestaurants();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {rejectTarget && (
        <RejectModal
          restaurant={rejectTarget}
          onConfirm={confirmReject}
          onCancel={() => setRejectTarget(null)}
          loading={rejectingId === rejectTarget?.id}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
              🏪
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Restaurants Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {restaurants.length} {activeTab === 'pending' ? 'pending requests' : 'restaurants'}
                {activeTab === 'pending' && approvedCount > 0 && ` · ${approvedCount} approved this session`}
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 mb-5 flex gap-2">
          {[
            { key: 'pending', label: 'Pending requests', icon: '⏳' },
            { key: 'active',  label: 'All restaurants',  icon: '🏪' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {icon} {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-0.5 ${
                activeTab === key ? 'bg-orange-400 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {restaurants.length}
              </span>
            </button>
          ))}
        </div>

        {/* Stats (pending tab) */}
        {activeTab === 'pending' && (restaurants.length > 0 || approvedCount > 0) && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-yellow-500">{restaurants.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pending</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-green-500">{approvedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Approved</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{restaurants.length + approvedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
            </div>
          </div>
        )}

        {/* Stats (active tab) */}
        {activeTab === 'active' && restaurants.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-green-500">
                {restaurants.filter((r) => r.is_active).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Open</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-red-400">
                {restaurants.filter((r) => !r.is_active).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Closed</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{restaurants.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading restaurants...</p>
            </div>
          </div>

        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button onClick={refresh} className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors">
              Retry
            </button>
          </div>

        ) : restaurants.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
            <div className="text-5xl mb-4">{activeTab === 'pending' ? '🎉' : '🏪'}</div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
              {activeTab === 'pending' ? 'All caught up!' : 'No restaurants yet'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'pending'
                ? 'No pending restaurant requests.'
                : 'No approved restaurants found.'}
            </p>
          </div>

        ) : (
          <div className="space-y-3">
            {activeTab === 'pending'
              ? restaurants.map((r) => (
                  <PendingCard
                    key={r.id} restaurant={r}
                    onApprove={handleApprove} onReject={handleReject}
                    approvingId={approvingId} rejectingId={rejectingId}
                  />
                ))
              : restaurants.map((r) => (
                  <ActiveCard
                    key={r.id} restaurant={r}
                    onToggle={handleToggle} togglingId={togglingId}
                  />
                ))
            }
          </div>
        )}

      </div>
    </div>
  );
}