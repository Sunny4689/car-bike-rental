import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import WheelLogo from '../components/WheelLogo';
import { FaLock, FaEnvelope, FaUserShield } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('rental_token', data.data.token);
      localStorage.setItem('rental_user', JSON.stringify(data.data));
      setUser(data.data);
      toast.success(`Welcome back, ${data.data.name}!`);
      if (data.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
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
              Sign In to <span className="text-secondary">WheelShare</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Access your reservations, verified fleet, and account</p>
          </div>
        </div>

        {/* Demo Quick Login Buttons for Evaluation */}
        <div className="bg-base-200/80 border border-base-300/50 p-3.5 rounded-2xl space-y-2 text-xs">
          <div className="font-bold text-gray-500 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <FaUserShield className="text-secondary" /> Evaluation One-Click Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@rental.com', 'admin123')}
              className="btn btn-outline btn-xs font-bold border-base-300 hover:border-secondary"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('user@rental.com', 'user123')}
              className="btn btn-outline btn-xs font-bold border-base-300 hover:border-secondary"
            >
              Demo User
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-xs">Email Address</span></label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full pl-9 text-xs focus:input-neutral"
                required
              />
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-xs">Password</span></label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? <span className="loading loading-spinner"></span> : 'Authenticate & Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-base-200">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
