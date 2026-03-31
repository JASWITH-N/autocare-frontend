import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Truck, LayoutList, Building, Loader2, Plus, Mail } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, showrooms, customers
  
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Showroom modal state
  const [showModal, setShowModal] = useState(false);
  const [newShowroom, setNewShowroom] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShowroom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newShowroom);
      setShowModal(false);
      setNewShowroom({ fullName: '', email: '', username: '', password: '' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create showroom');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const showrooms = users.filter(u => u.role === 'owner');
  const customers = users.filter(u => u.role === 'customer');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Platform overview and management</p>
        </div>
        
        {activeTab === 'showrooms' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center"
          >
            <Plus className="w-5 h-5 mr-1" /> Add Showroom
          </button>
        )}
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'bookings' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab('showrooms')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'showrooms' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Service Centers
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'customers' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Customers
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <LayoutList className="w-8 h-8"/>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-slate-500">Total Bookings</p>
              <p className="text-3xl font-bold text-slate-900">{bookings.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Truck className="w-8 h-8"/>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-slate-500">Active Services</p>
              <p className="text-3xl font-bold text-slate-900">
                {bookings.filter(b => ['Pending', 'Accepted', 'In Progress'].includes(b.status)).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-8 h-8"/>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-slate-500">Completed Services</p>
              <p className="text-3xl font-bold text-slate-900">
                {bookings.filter(b => b.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">
            {activeTab === 'bookings' && 'All System Bookings'}
            {activeTab === 'showrooms' && 'Registered Service Centers'}
            {activeTab === 'customers' && 'Registered Customers'}
          </h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                {activeTab === 'bookings' ? (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Center</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined Date</th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {activeTab === 'bookings' && bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{booking.customer?.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{booking.serviceCenter?.fullName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{booking.serviceType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'showrooms' && showrooms.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500 flex items-center"><Mail className="w-3 h-3 mr-1"/>{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}

                {activeTab === 'customers' && customers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500 flex items-center"><Mail className="w-3 h-3 mr-1"/>{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Register New Showroom</h2>
            <form onSubmit={handleCreateShowroom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Showroom Name</label>
                <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2"
                  value={newShowroom.fullName} onChange={e => setNewShowroom({...newShowroom, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Business Email</label>
                <input required type="email" className="mt-1 w-full border border-slate-300 rounded-lg p-2"
                  value={newShowroom.email} onChange={e => setNewShowroom({...newShowroom, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2"
                  value={newShowroom.username} onChange={e => setNewShowroom({...newShowroom, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Temporary Password</label>
                <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2"
                  value={newShowroom.password} onChange={e => setNewShowroom({...newShowroom, password: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
