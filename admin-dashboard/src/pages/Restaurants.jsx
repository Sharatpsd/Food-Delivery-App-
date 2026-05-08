import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Restaurants() {
  const [activeTab, setActiveTab] = useState('pending');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingRequests();
    } else {
      fetchRestaurants();
    }
  }, [activeTab]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRestaurantRequests();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveRestaurant(id);
      fetchPendingRequests();
    } catch (error) {
      console.error('Error approving restaurant:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = prompt('Enter rejection reason:');
      if (reason) {
        await adminAPI.rejectRestaurant(id, reason);
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleRestaurant(id);
      fetchRestaurants();
    } catch (error) {
      console.error('Error toggling restaurant:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants Management</h1>

      <div className="mb-6 flex gap-4">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pending Requests ({restaurants.length})
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded ${activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Active Restaurants ({restaurants.length})
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="border rounded-lg p-6 bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                  <p className="text-gray-600">{restaurant.city}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Owner: {restaurant.owner_name} ({restaurant.owner_email})
                  </p>
                  {activeTab === 'active' && (
                    <>
                      <p className="text-sm mt-2">Orders: {restaurant.order_count}</p>
                      <p className="text-sm">Revenue: ৳{restaurant.total_revenue}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {activeTab === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleApprove(restaurant.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(restaurant.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleToggle(restaurant.id)}
                      className={`px-4 py-2 rounded text-white ${restaurant.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {restaurant.is_active ? 'Close' : 'Open'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
