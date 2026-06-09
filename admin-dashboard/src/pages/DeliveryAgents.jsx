// DeliveryAgents.jsx — drop-in replacement

import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

function AgentAvatar({ name }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';
  const colors = [
    'bg-orange-100 text-orange-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-pink-100 text-pink-700',
  ];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

function AgentCard({ agent, onApprove, approving }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <AgentAvatar name={agent.name} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
            <span className="text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-2 py-0.5 rounded-full">
              Pending
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{agent.username}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              ✉️ {agent.email}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              📞 {agent.phone}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              🗓️ Joined {new Date(agent.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onApprove(agent.id)}
        disabled={approving === agent.id}
        className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
      >
        {approving === agent.id ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Approving…
          </>
        ) : (
          <>✅ Approve</>
        )}
      </button>
    </div>
  );
}

export default function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(null);
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => { fetchAgents(); }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getDeliveryAgentApprovals();
      setAgents(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agentId) => {
    try {
      setApproving(agentId);
      await adminAPI.approveDeliveryAgent(agentId);
      setAgents((prev) => prev.filter((a) => a.id !== agentId));
      setApprovedCount((c) => c + 1);
    } catch (err) {
      console.error('Error approving agent:', err);
    } finally {
      setApproving(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading agents...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Failed to load</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{error}</p>
          <button
            onClick={fetchAgents}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
              🛵
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Agent Approvals</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {agents.length} pending · {approvedCount} approved this session
              </p>
            </div>
          </div>
          <button
            onClick={fetchAgents}
            className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats bar */}
        {(agents.length > 0 || approvedCount > 0) && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-yellow-500">{agents.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pending</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-green-500">{approvedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Approved</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{agents.length + approvedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {agents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">All caught up!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">No pending delivery agent approvals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onApprove={handleApprove}
                approving={approving}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}