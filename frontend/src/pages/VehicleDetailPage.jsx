import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { formatPrice, calculateRentalDays, formatDate } from '../lib/utils';
import {
  FaGasPump,
  FaUsers,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaClock,
  FaShieldAlt,
  FaCar,
  FaMotorcycle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const locationOptions = ['Mumbai Central Hub', 'Andheri West Metro Station', 'Bandra Kurla Complex (BKC)', 'Thane Station East', 'Chhatrapati Shivaji Airport (T2)'];

const VehicleDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking & Calculator State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [pickupLocation, setPickupLocation] = useState(locationOptions[0]);
  const [returnLocation, setReturnLocation] = useState(locationOptions[0]);

  // Availability Check State
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking submission loading
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(dayAfter.toISOString().split('T')[0]);
  }, []);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/vehicles/${id}`);
      setVehicle(data.data);
    } catch (error) {
      toast.error('Vehicle not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const rentalDays = calculateRentalDays(startDate, endDate);
  const rawPrice = vehicle ? rentalDays * vehicle.pricePerDay : 0;
  const discount = rentalDays >= 5 ? Math.round(rawPrice * 0.1) : 0;
  const finalPrice = Math.max(0, rawPrice - discount);

  // Feature 7: Availability Check
  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both pickup and return dates');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }

    try {
      setCheckingAvailability(true);
      setAvailabilityResult(null);
      const { data } = await api.get(`/vehicles/${id}/availability?startDate=${startDate}&endDate=${endDate}`);
      setAvailabilityResult(data);
      if (data.available) {
        toast.success('Vehicle is available for the selected dates!');
      } else {
        toast.error(data.message || 'Vehicle is not available');
      }
    } catch (error) {
      toast.error('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Feature 8: Online Booking
  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error('Please sign in to complete your reservation');
      navigate('/login');
      return;
    }

    if (user.licenseStatus !== 'verified') {
      toast.error('Driving license verification required before reserving. Please update your profile.');
      navigate('/profile');
      return;
    }

    if (!startDate || !endDate || rentalDays <= 0) {
      toast.error('Please choose a valid rental date range');
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        vehicleId: vehicle._id,
        startDate,
        endDate,
        pickupTime,
        returnTime,
        pickupLocation,
        returnLocation,
      };

      const { data } = await api.post('/bookings', payload);
      toast.success(data.message || 'Reservation confirmed!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // Feature 12: Submit Review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      await api.post(`/vehicles/${id}/reviews`, {
        rating: Number(reviewRating),
        comment: reviewComment,
        userName: user ? user.name : 'Verified Customer',
      });
      toast.success('Thank you for your rating and review!');
      setReviewComment('');
      fetchVehicle();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-xs breadcrumbs text-gray-500">
        <ul>
          <li><Link to="/">Fleet</Link></li>
          <li><Link to={`/?type=${vehicle.type}`}>{vehicle.type}s</Link></li>
          <li className="font-bold text-base-content">{vehicle.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vehicle Details and Reviews (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-300 rounded-3xl overflow-hidden">
            <figure className="relative h-72 md:h-96 w-full bg-base-200">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge badge-md font-bold text-white bg-slate-900/90 border-none backdrop-blur-md">
                  {vehicle.type === 'Car' ? <FaCar className="mr-1 text-amber-400" /> : <FaMotorcycle className="mr-1 text-amber-400" />}
                  {vehicle.type}
                </span>
                <span className="badge badge-md font-semibold bg-white/90 text-slate-900 border-none backdrop-blur-md">
                  {vehicle.category}
                </span>
              </div>
            </figure>

            <div className="card-body p-6 md:p-8">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="text-xs font-bold text-secondary uppercase tracking-widest">{vehicle.brand}</div>
                  <h1 className="text-2xl md:text-3xl font-black text-base-content mt-1">{vehicle.name}</h1>
                </div>
                <div className="badge badge-neutral gap-1.5 font-bold text-xs py-3 px-3">
                  <FaStar className="text-amber-400" /> {vehicle.rating} / 5.0
                </div>
              </div>

              <p className="text-sm text-base-content/80 mt-3 leading-relaxed">{vehicle.description}</p>

              {/* Specifications Grid */}
              <div className="divider my-4"></div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-base-content mb-3">Vehicle Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-base-200/80 p-3.5 rounded-xl border border-base-300/50 flex flex-col gap-1">
                  <span className="text-gray-500 flex items-center gap-1.5 text-[11px]"><FaGasPump className="text-secondary" /> Fuel</span>
                  <span className="font-bold text-base-content text-sm">{vehicle.fuelType}</span>
                </div>
                <div className="bg-base-200/80 p-3.5 rounded-xl border border-base-300/50 flex flex-col gap-1">
                  <span className="text-gray-500 flex items-center gap-1.5 text-[11px]"><FaUsers className="text-secondary" /> Seating</span>
                  <span className="font-bold text-base-content text-sm">{vehicle.seatingCapacity} Seats</span>
                </div>
                <div className="bg-base-200/80 p-3.5 rounded-xl border border-base-300/50 flex flex-col gap-1">
                  <span className="text-gray-500 flex items-center gap-1.5 text-[11px]"><FaTachometerAlt className="text-secondary" /> Mileage</span>
                  <span className="font-bold text-base-content text-sm">{vehicle.mileage}</span>
                </div>
                <div className="bg-base-200/80 p-3.5 rounded-xl border border-base-300/50 flex flex-col gap-1">
                  <span className="text-gray-500 flex items-center gap-1.5 text-[11px]"><FaMapMarkerAlt className="text-secondary" /> Hub</span>
                  <span className="font-bold text-base-content text-sm truncate">{vehicle.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="card bg-base-100 shadow-sm border border-base-300 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                Customer Ratings & Feedback <span className="text-xs font-normal text-gray-500">({vehicle.reviews?.length || 0})</span>
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <FaStar /> <span>{vehicle.rating} / 5</span>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {!vehicle.reviews || vehicle.reviews.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No reviews yet. Be the first to leave feedback.</p>
              ) : (
                vehicle.reviews.map((rev, idx) => (
                  <div key={idx} className="bg-base-200/60 p-3.5 rounded-xl space-y-1 text-xs border border-base-300/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base-content">{rev.userName}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                    <p className="text-base-content/80 text-xs">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400">{formatDate(rev.date)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="pt-3 border-t border-base-300 space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-gray-500">Rating:</span>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="select select-bordered select-xs"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                  <option value={2}>⭐⭐ (2 - Below Average)</option>
                  <option value={1}>⭐ (1 - Unsatisfactory)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Leave verified feedback on performance, condition, or comfort..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="input input-bordered input-sm flex-1 text-xs"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-neutral btn-sm text-xs font-bold"
                >
                  {submittingReview ? 'Submitting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Reservation & Price Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-3xl sticky top-20 p-6 md:p-7 space-y-5">
            {/* Price Header */}
            <div className="flex justify-between items-baseline pb-4 border-b border-base-300">
              <div>
                <span className="text-3xl font-black text-base-content">{formatPrice(vehicle.pricePerDay)}</span>
                <span className="text-xs text-gray-500"> / day</span>
              </div>
              <span className="badge badge-outline border-secondary text-secondary font-bold text-[10px] uppercase tracking-wider">
                Transparent Pricing
              </span>
            </div>

            {/* Driving License Warning */}
            {user && user.licenseStatus !== 'verified' && (
              <div className="alert alert-warning p-3 text-xs flex items-center justify-between rounded-2xl">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-base shrink-0" />
                  <span>
                    License: <strong>{user.licenseStatus === 'pending' ? 'Verification Pending' : 'Submission Required'}</strong>
                  </span>
                </div>
                <Link to="/profile" className="btn btn-neutral btn-xs font-bold">Profile</Link>
              </div>
            )}

            {/* Date & Time Selection */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-base-content flex items-center gap-1.5">
                <FaCalendarAlt className="text-secondary" /> Rental Schedule
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="form-control">
                  <label className="label py-1"><span className="label-text text-[11px] font-semibold">Pickup Date</span></label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => { setStartDate(e.target.value); setAvailabilityResult(null); }}
                    className="input input-bordered input-sm text-xs"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text text-[11px] font-semibold">Return Date</span></label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => { setEndDate(e.target.value); setAvailabilityResult(null); }}
                    className="input input-bordered input-sm text-xs"
                  />
                </div>
              </div>

              {/* Time Pickers */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="form-control">
                  <label className="label py-1"><span className="label-text text-[11px] font-semibold flex items-center gap-1"><FaClock /> Pickup Time</span></label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="select select-bordered select-sm text-xs"
                  >
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>03:00 PM</option>
                    <option>06:00 PM</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text text-[11px] font-semibold flex items-center gap-1"><FaClock /> Return Time</span></label>
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="select select-bordered select-sm text-xs"
                  >
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>03:00 PM</option>
                    <option>06:00 PM</option>
                    <option>09:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Pickup & Return Hubs */}
              <div className="form-control text-xs">
                <label className="label py-1"><span className="label-text text-[11px] font-semibold">Pickup Hub</span></label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="select select-bordered select-sm text-xs"
                >
                  {locationOptions.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div className="form-control text-xs">
                <label className="label py-1"><span className="label-text text-[11px] font-semibold">Return Hub</span></label>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="select select-bordered select-sm text-xs"
                >
                  {locationOptions.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            {/* Check Availability */}
            <div>
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="btn btn-outline btn-sm w-full gap-2 text-xs font-bold"
              >
                {checkingAvailability ? <span className="loading loading-spinner loading-xs"></span> : <FaCalendarAlt />}
                Check Live Availability
              </button>

              {availabilityResult && (
                <div className={`mt-2 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  availabilityResult.available ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
                }`}>
                  {availabilityResult.available ? <FaCheckCircle /> : <FaTimesCircle />}
                  <span>{availabilityResult.message}</span>
                </div>
              )}
            </div>

            {/* Price Calculator Breakdown */}
            <div className="bg-base-200/80 border border-base-300/60 p-4 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-base-content uppercase tracking-wider text-[11px] mb-1">
                Estimated Fare Calculator
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Daily Rate:</span>
                <span>{formatPrice(vehicle.pricePerDay)} × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span>{formatPrice(rawPrice)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success font-semibold">
                  <span>Extended Rental (10% off):</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="divider my-1"></div>
              <div className="flex justify-between items-center text-sm font-black text-base-content">
                <span>Total Fare:</span>
                <span className="text-xl text-secondary">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            {/* Confirm & Reserve Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={bookingLoading || rentalDays <= 0 || !vehicle.isAvailable}
              className="btn btn-neutral w-full shadow-lg text-sm font-bold uppercase tracking-wider text-white"
            >
              {bookingLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                `Confirm Reservation • ${formatPrice(finalPrice)}`
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center">
              🔒 Instant confirmation. Zero upfront cancellation fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
