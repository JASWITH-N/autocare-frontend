import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, Clock, Loader2, CheckCircle2, Car, XCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceCenters, setServiceCenters] = useState([]);
  
  const [newBooking, setNewBooking] = useState({
    serviceCenterId: '',
    vehicleType: '',
    serviceType: '',
    date: '',
    timeSlot: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchServiceCenters();
  }, []);

  const fetchServiceCenters = async () => {
    try {
      const { data } = await api.get('/users/owners');
      setServiceCenters(data);
    } catch (error) {
      console.error('Failed to fetch showrooms', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings/mybookings');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    try {
      if (!newBooking.serviceCenterId) {
        alert('Please select a service center');
        return;
      }
      const payload = {
        ...newBooking
      };
      await api.post('/bookings', payload);
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book service');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.fullName}</h1>
          <p className="text-slate-600 mt-1">Manage your vehicle services and bookings</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book New Service
        </button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Your Booking History</h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-1">No bookings yet</h4>
            <p className="text-slate-500">You haven't booked any vehicle services.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-6">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <Car className="w-8 h-8 text-indigo-600" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 mb-1">
                    {booking.serviceType} for {booking.vehicleType}
                  </h4>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> {new Date(booking.date).toLocaleDateString()}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-slate-400"/> {booking.timeSlot}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">ID: {booking._id.substring(0, 8)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Book a Service</h2>
            
            <form onSubmit={handleBookService} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Details</label>
                 <input 
                   required type="text" placeholder="e.g. Honda Civic 2020"
                   className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                   value={newBooking.vehicleType}
                   onChange={e => setNewBooking({...newBooking, vehicleType: e.target.value})}
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Service Center</label>
                 <select 
                   required className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                   value={newBooking.serviceCenterId}
                   onChange={e => setNewBooking({...newBooking, serviceCenterId: e.target.value})}
                 >
                   <option value="">Select a Showroom...</option>
                   {serviceCenters.map(center => (
                     <option key={center._id} value={center._id}>{center.fullName} ({center.email})</option>
                   ))}
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
                 <select 
                   required className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                   value={newBooking.serviceType}
                   onChange={e => setNewBooking({...newBooking, serviceType: e.target.value})}
                 >
                   <option value="">Select Service...</option>
                   <option value="General Maintenance">General Maintenance</option>
                   <option value="Oil Change">Oil Change</option>
                   <option value="Brake Inspection">Brake Inspection</option>
                   <option value="Tire Replacement">Tire Replacement</option>
                 </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    required type="date"
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={newBooking.date}
                    onChange={e => setNewBooking({...newBooking, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                  <select 
                    required className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    value={newBooking.timeSlot}
                    onChange={e => setNewBooking({...newBooking, timeSlot: e.target.value})}
                  >
                    <option value="">Select Time...</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
