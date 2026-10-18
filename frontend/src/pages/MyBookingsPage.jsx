import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { formatPrice, formatDate } from '../lib/utils';
import { FaCalendarAlt, FaMapMarkerAlt, FaCar, FaMotorcycle, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyBookingsPage = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings/my');
      setBookings(data.data || []);
    } catch (error) {
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this rental booking?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('Rental booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning max-w-md mx-auto my-12">
        <span>Please log in to view and manage your rental bookings.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-base-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-base-content">My Rental Bookings</h1>
          <p className="text-xs text-gray-500">Manage your active reservations, pickup schedules, and trip history</p>
        </div>
        <Link to="/" className="btn btn-primary btn-sm text-white">
          + Book Another Vehicle
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-3xl text-gray-400 mb-3">
            <FaCalendarAlt />
          </div>
          <h3 className="text-xl font-bold text-base-content mb-1">No Bookings Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mb-4">
            You haven't reserved any vehicles yet. Explore our fleet of cars and bikes to get started!
          </p>
          <Link to="/" className="btn btn-primary btn-sm text-white">
            Browse All Vehicles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const vehicle = booking.vehicle;
            const isConfirmed = booking.status === 'confirmed';
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking._id}
                className="card bg-base-100 border border-base-200 shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center">
                  {/* Vehicle Image & Basic Info (4 cols) */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <img
                      src={vehicle?.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500'}
                      alt={vehicle?.name || 'Vehicle'}
                      className="w-24 h-20 object-cover rounded-xl bg-base-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                        {vehicle?.type === 'Car' ? <FaCar /> : <FaMotorcycle />} {vehicle?.type} • {vehicle?.category}
                      </div>
                      <h3 className="font-bold text-base text-base-content truncate">
                        {vehicle?.name || 'Vehicle Listing'}
                      </h3>
                      <div className="text-xs text-gray-500 font-semibold">{vehicle?.brand}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1">ID: #{booking._id.slice(-6)}</div>
                    </div>
                  </div>

                  {/* Dates & Duration (4 cols) */}
                  <div className="md:col-span-4 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <FaCalendarAlt className="text-primary" />
                      <span>{formatDate(booking.startDate)} → {formatDate(booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <FaClock className="text-primary" />
                      <span>{booking.pickupTime || '10:00 AM'} to {booking.returnTime || '10:00 AM'}</span>
                      <span className="badge badge-neutral badge-xs font-bold">{booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-[11px] truncate" title={booking.pickupLocation}>
                      <FaMapMarkerAlt className="text-primary" />
                      <span>Pickup: {booking.pickupLocation}</span>
                    </div>
                  </div>

                  {/* Status, Price & Cancel Action (4 cols) */}
                  <div className="md:col-span-4 flex flex-col md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-base-200">
                    <div className="flex items-center gap-2">
                      {isConfirmed && (
                        <span className="badge badge-success text-white font-bold gap-1 text-xs">
                          <FaCheckCircle /> Confirmed
                        </span>
                      )}
                      {isCancelled && (
                        <span className="badge badge-error text-white font-bold gap-1 text-xs">
                          <FaTimesCircle /> Cancelled
                        </span>
                      )}
                      {booking.status === 'completed' && (
                        <span className="badge badge-neutral font-bold gap-1 text-xs">
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-gray-400">Total Rental Fare</div>
                      <div className="text-lg font-black text-primary">{formatPrice(booking.totalPrice)}</div>
                    </div>

                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-outline btn-error btn-xs"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
