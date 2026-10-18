import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import WheelLogo from '../components/WheelLogo';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('rental_token', data.data.token);
      localStorage.setItem('rental_user', JSON.stringify(data.data));
      setUser(data.data);
      toast.success('Registration successful! Please submit your driving license to start booking.');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 animate-fade-in-up">
      <div className="card bg-base-100 shadow-xl border border-base-300 rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <WheelLogo size="xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-base-content">
              Join <span className="text-secondary">WheelShare</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Create an account to unlock car and bike rentals</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-xs">Full Name</span></label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Ayaan Kadavaikar"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full pl-9 text-xs focus:input-neutral"
                required
              />
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-xs">Email Address</span></label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="ayaan@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full pl-9 text-xs focus:input-neutral"
                required
              />
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-xs">Contact Phone</span></label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full pl-9 text-xs focus:input-neutral"
              />
              <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-xs">Password</span></label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full pl-9 text-xs focus:input-neutral"
                required
              />
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-neutral w-full shadow-md text-xs font-bold uppercase tracking-wider mt-2"
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-base-200">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
