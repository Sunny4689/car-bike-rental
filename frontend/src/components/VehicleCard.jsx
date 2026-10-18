import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { FaGasPump, FaUsers, FaTachometerAlt, FaMapMarkerAlt, FaStar, FaCar, FaMotorcycle } from 'react-icons/fa';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-base-300 rounded-2xl overflow-hidden flex flex-col group">
      {/* Vehicle Image */}
      <figure className="relative h-48 w-full overflow-hidden bg-base-200">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop';
          }}
        />
        {/* Type & Category Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge badge-sm font-bold gap-1 text-[11px] bg-slate-900/90 text-white border-none backdrop-blur-md">
            {vehicle.type === 'Car' ? <FaCar className="text-amber-400" /> : <FaMotorcycle className="text-amber-400" />} {vehicle.type}
          </span>
          <span className="badge badge-sm font-semibold text-[11px] bg-white/90 text-slate-900 border-none backdrop-blur-md shadow-xs">
            {vehicle.category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 badge badge-sm font-bold gap-1 text-[11px] bg-slate-900/90 text-amber-400 border-none backdrop-blur-md shadow-xs">
          <FaStar className="text-amber-400" /> {vehicle.rating || 4.8}
        </div>

        {/* Unavailable overlay */}
        {!vehicle.isAvailable && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="badge badge-error badge-sm font-bold text-white shadow-lg uppercase tracking-wider text-[10px]">
              Unavailable
            </span>
          </div>
        )}
      </figure>

      {/* Card Body */}
      <div className="card-body p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            {vehicle.brand}
          </div>
          <h2 className="card-title text-base font-bold text-base-content truncate mt-0.5" title={vehicle.name}>
            {vehicle.name}
          </h2>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs text-base-content/70">
            <div className="flex items-center gap-1.5 bg-base-200/80 px-2 py-1.5 rounded-lg border border-base-300/50">
              <FaGasPump className="text-secondary text-xs shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-base-200/80 px-2 py-1.5 rounded-lg border border-base-300/50">
              <FaUsers className="text-secondary text-xs shrink-0" />
              <span>{vehicle.seatingCapacity} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-base-200/80 px-2 py-1.5 rounded-lg border border-base-300/50">
              <FaTachometerAlt className="text-secondary text-xs shrink-0" />
              <span className="truncate">{vehicle.mileage}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-base-200/80 px-2 py-1.5 rounded-lg border border-base-300/50" title={vehicle.location}>
              <FaMapMarkerAlt className="text-secondary text-xs shrink-0" />
              <span className="truncate">{vehicle.location}</span>
            </div>
          </div>
        </div>

        {/* Footer with Price and Action */}
        <div className="pt-3 border-t border-base-200 flex items-center justify-between mt-auto">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Daily Rate</div>
            <div className="text-lg font-black text-base-content">
              {formatPrice(vehicle.pricePerDay)}
              <span className="text-xs font-normal text-gray-500">/day</span>
            </div>
          </div>
          <Link
            to={`/vehicle/${vehicle._id}`}
            className="btn btn-neutral btn-sm text-xs font-bold px-3.5 shadow-sm hover:border-secondary"
          >
            Reserve
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
