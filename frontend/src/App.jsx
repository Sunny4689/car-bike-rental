import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  const [user, setUser] = useState(null);
  
  // Theme state: read from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wheelshare_theme') || 'light';
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wheelshare_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Restore authenticated session from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('rental_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading stored user:', e);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-base-200/50 text-base-content font-sans antialiased transition-colors duration-300">
        <Navbar user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />
        
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailPage user={user} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage setUser={setUser} />} />
            <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="/my-bookings" element={<MyBookingsPage user={user} />} />
            <Route path="/admin" element={<AdminDashboardPage user={user} />} />
          </Routes>
        </main>

        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
