import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { formatPrice, formatDate } from '../lib/utils';
import {
  FaCar,
  FaMotorcycle,
  FaIdCard,
  FaCalendarCheck,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const initialVehicleForm = {
  name: '',
  brand: '',
  type: 'Car',
  category: 'Sedan',
  pricePerDay: '',
  fuelType: 'Petrol',
  seatingCapacity: 5,
  mileage: '18 km/l',
  location: 'Mumbai Central',
  imageUrl: '',
  description: '',
  isAvailable: true,
};

const AdminDashboardPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' | 'licenses' | 'bookings'

  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for Add & Edit Vehicle
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
  const [savingVehicle, setSavingVehicle] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [vRes, uRes, bRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/auth/admin/users'),
        api.get('/bookings'),
      ]);
      setVehicles(vRes.data.data || []);
      setUsersList(uRes.data.data || []);
      setAllBookings(bRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllData();
    }
  }, [user]);

  // Open modal for Adding new vehicle
  const handleOpenAddModal = () => {
    setEditingVehicleId(null);
    setVehicleForm(initialVehicleForm);
    setShowVehicleModal(true);
  };

  // Open modal for Editing existing vehicle
  const handleOpenEditModal = (veh) => {
    setEditingVehicleId(veh._id);
    setVehicleForm({
      name: veh.name,
      brand: veh.brand,
      type: veh.type,
      category: veh.category,
      pricePerDay: veh.pricePerDay,
      fuelType: veh.fuelType,
      seatingCapacity: veh.seatingCapacity,
      mileage: veh.mileage,
      location: veh.location,
      imageUrl: veh.imageUrl,
      description: veh.description,
      isAvailable: veh.isAvailable,
    });
    setShowVehicleModal(true);
  };

  // Save Vehicle (Create or Update)
  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    try {
      setSavingVehicle(true);
      if (editingVehicleId) {
        await api.put(`/vehicles/${editingVehicleId}`, vehicleForm);
        toast.success('Vehicle updated successfully');
      } else {
        await api.post('/vehicles', vehicleForm);
        toast.success('Vehicle added to fleet successfully');
      }
      setShowVehicleModal(false);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSavingVehicle(false);
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/vehicles/${id}`);
      toast.success(`${name} deleted from fleet`);
      setVehicles(vehicles.filter((v) => v._id !== id));
    } catch (error) {
      toast.error('Failed to delete vehicle');
    }
  };

  // License Verification (Feature 14)
  const handleVerifyLicense = async (userId, status) => {
    try {
      await api.put(`/auth/admin/verify-license/${userId}`, { status });
      toast.success(`License marked as ${status}`);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, licenseStatus: status } : u))
      );
    } catch (error) {
      toast.error('Failed to update license status');
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking status changed to ${status}`);
      setAllBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="alert alert-error max-w-md mx-auto my-12">
        <span>Access Denied: Only administrators can access this portal.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-base-200">
        <div>
          <div className="badge badge-primary font-bold text-xs uppercase mb-1">Administrator Portal</div>
          <h1 className="text-2xl md:text-3xl font-black text-base-content">WheelShare Fleet & Admin Hub</h1>
          <p className="text-xs text-gray-500">Manage vehicles (CRUD), verify driving licenses, and supervise bookings</p>
        </div>
        {activeTab === 'vehicles' && (
          <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm text-white gap-2 shadow">
            <FaPlus /> Add New Vehicle
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-1.5 rounded-2xl shadow-sm border border-base-200">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`tab tab-md font-bold gap-2 ${activeTab === 'vehicles' ? 'tab-active !bg-primary !text-white' : ''}`}
        >
          <FaCar /> Vehicle Fleet ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('licenses')}
          className={`tab tab-md font-bold gap-2 ${activeTab === 'licenses' ? 'tab-active !bg-primary !text-white' : ''}`}
        >
          <FaIdCard /> License Verification ({usersList.filter((u) => u.licenseStatus === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`tab tab-md font-bold gap-2 ${activeTab === 'bookings' ? 'tab-active !bg-primary !text-white' : ''}`}
        >
          <FaCalendarCheck /> Customer Bookings ({allBookings.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          {/* TAB 1: VEHICLE FLEET MANAGEMENT */}
          {activeTab === 'vehicles' && (
            <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead className="bg-base-200 text-xs text-gray-600">
                    <tr>
                      <th>Vehicle</th>
                      <th>Type & Category</th>
                      <th>Price / Day</th>
                      <th>Fuel & Mileage</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((veh) => (
                      <tr key={veh._id} className="hover">
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={veh.imageUrl}
                              alt={veh.name}
                              className="w-14 h-11 object-cover rounded-lg bg-base-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500';
                              }}
                            />
                            <div>
                              <div className="font-bold text-sm text-base-content">{veh.name}</div>
                              <div className="text-xs text-gray-400">{veh.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="badge badge-neutral badge-xs font-bold mr-1">{veh.type}</div>
                          <span className="text-xs text-gray-600">{veh.category}</span>
                        </td>
                        <td className="font-bold text-primary text-sm">{formatPrice(veh.pricePerDay)}</td>
                        <td className="text-xs text-gray-500">
                          <div>{veh.fuelType}</div>
                          <div>{veh.mileage}</div>
                        </td>
                        <td className="text-xs text-gray-600 font-medium">{veh.location}</td>
                        <td>
                          {veh.isAvailable ? (
                            <span className="badge badge-success badge-xs text-white font-bold">Active</span>
                          ) : (
                            <span className="badge badge-error badge-xs text-white font-bold">Inactive</span>
                          )}
                        </td>
                        <td className="text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(veh)}
                            className="btn btn-ghost btn-xs text-info hover:bg-info/10"
                            title="Edit Vehicle"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(veh._id, veh.name)}
                            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                            title="Delete Vehicle"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DRIVING LICENSE VERIFICATION */}
          {activeTab === 'licenses' && (
            <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead className="bg-base-200 text-xs text-gray-600">
                    <tr>
                      <th>User Name & Contact</th>
                      <th>License Number</th>
                      <th>Document Image</th>
                      <th>Current Status</th>
                      <th className="text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr._id} className="hover">
                        <td>
                          <div className="font-bold text-sm text-base-content">{usr.name}</div>
                          <div className="text-xs text-gray-500">{usr.email}</div>
                          <div className="text-[11px] text-gray-400">{usr.phone || 'No phone'}</div>
                        </td>
                        <td>
                          {usr.drivingLicenseNumber ? (
                            <span className="font-mono text-xs font-bold text-base-content bg-base-200 px-2 py-1 rounded">
                              {usr.drivingLicenseNumber}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Not entered</span>
                          )}
                        </td>
                        <td>
                          {usr.drivingLicenseImage ? (
                            <a
                              href={usr.drivingLicenseImage}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost btn-xs gap-1 text-primary"
                            >
                              <FaExternalLinkAlt /> View License
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No image uploaded</span>
                          )}
                        </td>
                        <td>
                          {usr.licenseStatus === 'verified' && (
                            <span className="badge badge-success text-white font-bold badge-sm">Verified</span>
                          )}
                          {usr.licenseStatus === 'pending' && (
                            <span className="badge badge-warning font-bold badge-sm">Pending Review</span>
                          )}
                          {usr.licenseStatus === 'rejected' && (
                            <span className="badge badge-error text-white font-bold badge-sm">Rejected</span>
                          )}
                          {(!usr.licenseStatus || usr.licenseStatus === 'unsubmitted') && (
                            <span className="badge badge-ghost text-gray-400 font-semibold badge-sm">Unsubmitted</span>
                          )}
                        </td>
                        <td className="text-right space-x-2">
                          <button
                            onClick={() => handleVerifyLicense(usr._id, 'verified')}
                            className="btn btn-success btn-xs text-white gap-1"
                            title="Approve License"
                          >
                            <FaCheck /> Verify
                          </button>
                          <button
                            onClick={() => handleVerifyLicense(usr._id, 'rejected')}
                            className="btn btn-error btn-xs text-white gap-1"
                            title="Reject License"
                          >
                            <FaTimes /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER BOOKINGS MASTER */}
          {activeTab === 'bookings' && (
            <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead className="bg-base-200 text-xs text-gray-600">
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer Details</th>
                      <th>Vehicle</th>
                      <th>Dates & Duration</th>
                      <th>Total Fare</th>
                      <th>Status</th>
                      <th className="text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((b) => (
                      <tr key={b._id} className="hover">
                        <td className="font-mono text-xs font-bold">#{b._id.slice(-6)}</td>
                        <td>
                          <div className="font-bold text-xs text-base-content">{b.user?.name || 'Customer'}</div>
                          <div className="text-[11px] text-gray-500">{b.user?.email}</div>
                          <div className="text-[11px] text-gray-400">{b.user?.phone}</div>
                        </td>
                        <td>
                          <div className="font-bold text-xs">{b.vehicle?.name || 'Vehicle'}</div>
                          <div className="text-[11px] text-gray-400">{b.vehicle?.brand}</div>
                        </td>
                        <td className="text-xs">
                          <div>{formatDate(b.startDate)} → {formatDate(b.endDate)}</div>
                          <span className="badge badge-neutral badge-xs">{b.totalDays} days</span>
                        </td>
                        <td className="font-extrabold text-sm text-primary">{formatPrice(b.totalPrice)}</td>
                        <td>
                          {b.status === 'confirmed' && <span className="badge badge-success text-white badge-xs">Confirmed</span>}
                          {b.status === 'completed' && <span className="badge badge-neutral badge-xs">Completed</span>}
                          {b.status === 'cancelled' && <span className="badge badge-error text-white badge-xs">Cancelled</span>}
                        </td>
                        <td className="text-right">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                            className="select select-bordered select-xs"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ADD / EDIT VEHICLE MODAL */}
      {showVehicleModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-extrabold text-xl text-primary mb-4">
              {editingVehicleId ? 'Edit Vehicle Details' : 'Add New Vehicle to Fleet'}
            </h3>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Vehicle Model Name</span></label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                    placeholder="e.g. Honda City ZX"
                    className="input input-bordered input-sm focus:input-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Brand / Manufacturer</span></label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    placeholder="e.g. Honda, Yamaha, Toyota"
                    className="input input-bordered input-sm focus:input-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Vehicle Type</span></label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                    className="select select-bordered select-sm"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Category</span></label>
                  <select
                    value={vehicleForm.category}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                    className="select select-bordered select-sm"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Sports Bike">Sports Bike</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Daily Rent Rate (₹/day)</span></label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.pricePerDay}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, pricePerDay: e.target.value })}
                    placeholder="e.g. 2000"
                    className="input input-bordered input-sm focus:input-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Fuel Type</span></label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                    className="select select-bordered select-sm"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Seating Capacity</span></label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.seatingCapacity}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, seatingCapacity: e.target.value })}
                    className="input input-bordered input-sm focus:input-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Mileage (e.g. 18 km/l)</span></label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.mileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                    className="input input-bordered input-sm focus:input-primary"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Available Hub / Location</span></label>
                <input
                  type="text"
                  required
                  value={vehicleForm.location}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, location: e.target.value })}
                  placeholder="e.g. Mumbai Central, Andheri West"
                  className="input input-bordered input-sm focus:input-primary"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Image URL</span></label>
                <input
                  type="url"
                  required
                  value={vehicleForm.imageUrl}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input input-bordered input-sm focus:input-primary"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Description</span></label>
                <textarea
                  rows="2"
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                  placeholder="Vehicle specifications, transmission, features..."
                  className="textarea textarea-bordered textarea-sm"
                ></textarea>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={vehicleForm.isAvailable}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isAvailable: e.target.checked })}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="label-text font-bold">Mark as Available for Rent</span>
                </label>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="btn btn-primary btn-sm text-white"
                >
                  {savingVehicle ? 'Saving...' : editingVehicleId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
