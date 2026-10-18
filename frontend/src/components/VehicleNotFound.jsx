import { FaCarCrash } from 'react-icons/fa';

const VehicleNotFound = ({ onReset }) => {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm p-10 text-center flex flex-col items-center justify-center my-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mb-4">
        <FaCarCrash />
      </div>
      <h3 className="text-xl font-bold text-base-content mb-1">No Vehicles Match Your Search</h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">
        We couldn't find any cars or bikes matching your current search and filter settings. Try adjusting your brand, category, or location filters.
      </p>
      {onReset && (
        <button onClick={onReset} className="btn btn-outline btn-primary btn-sm">
          Reset All Filters
        </button>
      )}
    </div>
  );
};

export default VehicleNotFound;
