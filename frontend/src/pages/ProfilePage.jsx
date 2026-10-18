import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { FaUserCircle, FaIdCard, FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProfilePage = ({ user, setUser }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [licenseNumber, setLicenseNumber] = useState(user?.drivingLicenseNumber || '');
  const [licenseImage, setLicenseImage] = useState(user?.drivingLicenseImage || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [submittingLicense, setSubmittingLicense] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
      setLicenseNumber(user.drivingLicenseNumber || '');
      setLicenseImage(user.drivingLicenseImage || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const { data } = await api.put('/auth/profile', {
        name: profileData.name,
        phone: profileData.phone,
      });
      localStorage.setItem('rental_user', JSON.stringify(data.data));
      setUser(data.data);
      toast.success('Profile details updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    if (!licenseNumber.trim()) {
      toast.error('Please enter your driving license number');
      return;
    }

    try {
      setSubmittingLicense(true);
      const { data } = await api.post('/auth/license', {
        drivingLicenseNumber: licenseNumber,
        drivingLicenseImage: licenseImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
      });

      const updatedUser = {
        ...user,
        drivingLicenseNumber: data.data.drivingLicenseNumber,
        drivingLicenseImage: data.data.drivingLicenseImage,
        licenseStatus: data.data.licenseStatus,
      };

      localStorage.setItem('rental_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Driving license submitted! Awaiting admin verification.');
    } catch (error) {
      toast.error('Failed to submit driving license');
    } finally {
      setSubmittingLicense(false);
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning max-w-md mx-auto my-12">
        <span>Please log in to view your profile and driving license details.</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200">
        <FaUserCircle className="text-6xl text-primary" />
        <div>
          <h1 className="text-2xl font-black text-base-content">{user.name}</h1>
          <p className="text-xs text-gray-500">{user.email} • Role: <span className="badge badge-neutral uppercase font-bold text-[10px]">{user.role}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info Form */}
        <div className="card bg-base-100 shadow-md border border-base-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
            Personal Information
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Full Name</span></label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input input-bordered input-sm focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Email Address</span></label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="input input-bordered input-sm bg-base-200 cursor-not-allowed"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Phone Number</span></label>
              <input
                type="tel"
                value={profileData.phone}
                placeholder="+91 98765 43210"
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="input input-bordered input-sm focus:input-primary"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="btn btn-primary btn-sm w-full text-white"
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Feature 14: Driving License Verification Form */}
        <div className="card bg-base-100 shadow-md border border-base-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <FaIdCard className="text-primary" /> Driving License Verification
            </h2>

            {/* Status Pill */}
            {user.licenseStatus === 'verified' && (
              <span className="badge badge-success text-white font-bold gap-1 text-xs">
                <FaCheckCircle /> Verified
              </span>
            )}
            {user.licenseStatus === 'pending' && (
              <span className="badge badge-warning font-bold gap-1 text-xs">
                <FaExclamationTriangle /> Under Review
              </span>
            )}
            {(user.licenseStatus === 'unsubmitted' || !user.licenseStatus) && (
              <span className="badge badge-error text-white font-bold gap-1 text-xs">
                <FaTimesCircle /> Not Submitted
              </span>
            )}
            {user.licenseStatus === 'rejected' && (
              <span className="badge badge-error text-white font-bold gap-1 text-xs">
                <FaTimesCircle /> Rejected
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Government driving license verification is mandatory before renting any car or bike on WheelShare.
          </p>

          {user.licenseStatus === 'verified' ? (
            <div className="bg-success/10 border border-success/30 rounded-2xl p-4 text-xs space-y-2 text-success-content">
              <div className="font-bold flex items-center gap-2 text-success">
                <FaShieldAlt className="text-lg" /> Your Driving License is Verified
              </div>
              <p className="text-gray-600">
                License Number: <strong className="text-base-content">{user.drivingLicenseNumber}</strong>
              </p>
              <p className="text-gray-500 text-[11px]">
                You have full authorization to book any car or bike across all branches.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLicenseSubmit} className="space-y-4 text-xs">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Driving License Number</span></label>
                <input
                  type="text"
                  placeholder="e.g. MH-01-2022-0012345"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="input input-bordered input-sm focus:input-primary font-mono uppercase"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">License Document URL (Photo/Scanned Copy)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={licenseImage}
                  onChange={(e) => setLicenseImage(e.target.value)}
                  className="input input-bordered input-sm focus:input-primary"
                />
                <span className="text-[10px] text-gray-400 mt-1">
                  Provide any image URL or leave blank to use the default evaluation sample.
                </span>
              </div>

              <button
                type="submit"
                disabled={submittingLicense}
                className="btn btn-neutral btn-sm w-full font-bold"
              >
                {submittingLicense ? 'Submitting...' : 'Submit License for Verification'}
              </button>

              <div className="text-[11px] text-gray-500 bg-base-200 p-2.5 rounded-xl">
                💡 <strong>Exam Note:</strong> Log in as Admin (<code>admin@rental.com</code>) to view the Admin Dashboard and click "Approve" to verify your license instantly!
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
