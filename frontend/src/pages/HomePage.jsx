import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import VehicleCard from '../components/VehicleCard';
import VehicleNotFound from '../components/VehicleNotFound';
import { FaSearch, FaCar, FaMotorcycle, FaThLarge, FaShieldAlt, FaKey, FaGasPump } from 'react-icons/fa';

const locations = ['All Locations', 'Mumbai Central', 'Andheri West', 'Bandra', 'Thane'];
const categories = ['All Categories', 'Sedan', 'SUV', 'Hatchback', 'Cruiser', 'Sports Bike', 'Scooter'];
const fuelTypes = ['All Fuels', 'Petrol', 'Diesel', 'Electric'];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFuel, setSelectedFuel] = useState('All Fuels');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortPrice, setSortPrice] = useState('');

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && ['Car', 'Bike'].includes(typeFromUrl)) {
      setSelectedType(typeFromUrl);
    } else {
      setSelectedType('All');
    }
  }, [searchParams]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (search.trim()) params.append('search', search.trim());
      if (selectedType !== 'All') params.append('type', selectedType);
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (selectedFuel !== 'All Fuels') params.append('fuelType', selectedFuel);
      if (selectedLocation !== 'All Locations') params.append('location', selectedLocation);
      if (sortPrice) params.append('sortPrice', sortPrice);

      const { data } = await api.get(`/vehicles?${params.toString()}`);
      setVehicles(data.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedType, selectedCategory, selectedFuel, selectedLocation, sortPrice]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('All');
    setSelectedCategory('All Categories');
    setSelectedFuel('All Fuels');
    setSelectedLocation('All Locations');
    setSortPrice('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Executive Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white p-8 md:p-14 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            WheelShare Executive Fleet
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Premium Car & Bike Rentals on Demand
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Drive verified luxury sedans, rugged SUVs, and high-performance motorcycles. Real-time availability, clear rates, and zero hidden charges.
          </p>

          {/* Type Filter Buttons */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => { setSelectedType('All'); setSearchParams({}); }}
              className={`btn btn-sm text-xs font-bold ${selectedType === 'All' ? 'btn-secondary text-white' : 'btn-outline border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              <FaThLarge /> All Fleet ({vehicles.length})
            </button>
            <button
              onClick={() => { setSelectedType('Car'); setSearchParams({ type: 'Car' }); }}
              className={`btn btn-sm text-xs font-bold ${selectedType === 'Car' ? 'btn-secondary text-white' : 'btn-outline border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              <FaCar /> Cars
            </button>
            <button
              onClick={() => { setSelectedType('Bike'); setSearchParams({ type: 'Bike' }); }}
              className={`btn btn-sm text-xs font-bold ${selectedType === 'Bike' ? 'btn-secondary text-white' : 'btn-outline border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              <FaMotorcycle /> Bikes
            </button>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="relative z-10 pt-8 mt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <FaShieldAlt />
            </div>
            <span>Government Verified Driving Licenses</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <FaKey />
            </div>
            <span>Instant Availability & Digital Check-In</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <FaGasPump />
            </div>
            <span>Fully Sanitized, Inspected & Fuelled</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search by car, bike or brand name..."
              className="input input-bordered w-full pl-10 focus:input-neutral text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          </div>

          {/* Location Filter */}
          <div className="md:col-span-2">
            <select
              className="select select-bordered w-full text-xs"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              className="select select-bordered w-full text-xs"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Fuel Filter */}
          <div className="md:col-span-2">
            <select
              className="select select-bordered w-full text-xs"
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
            >
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </select>
          </div>

          {/* Price Sort */}
          <div className="md:col-span-2">
            <select
              className="select select-bordered w-full text-xs font-semibold"
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
            >
              <option value="">Sort: Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
            Select Your Vehicle <span className="text-xs font-normal text-gray-500">({vehicles.length} listings)</span>
          </h2>
          {(search || selectedType !== 'All' || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations') && (
            <button onClick={handleResetFilters} className="text-xs text-secondary font-bold hover:underline">
              Clear All Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card bg-base-100 border border-base-300 shadow-sm animate-pulse h-80 rounded-2xl"></div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <VehicleNotFound onReset={handleResetFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
