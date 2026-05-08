import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDeliveryAgentApprovals();
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching delivery agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agentId) => {
    try {
      await adminAPI.approveDeliveryAgent(agentId);
      fetchAgents();
    } catch (error) {
      console.error('Error approving agent:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Agents Approvals</h1>

      {loading ? (
        <div>Loading...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No pending delivery agent approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map(agent => (
            <div key={agent.id} className="border rounded-lg p-6 bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{agent.name}</h3>
                  <p className="text-gray-600">Email: {agent.email}</p>
                  <p className="text-gray-600">Phone: {agent.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Joined: {new Date(agent.date_joined).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Username: {agent.username}
                  </p>
                </div>
                <button 
                  onClick={() => handleApprove(agent.id)}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
