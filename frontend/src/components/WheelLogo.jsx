const WheelLogo = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className={`${currentSize} filter drop-shadow-sm transition-transform duration-700 hover:rotate-180`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Tread Rim */}
        <circle cx="50" cy="50" r="46" stroke="#1e293b" strokeWidth="7" />
        <circle cx="50" cy="50" r="42.5" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 3" />
        
        {/* Inner Alloy Wheel Rim */}
        <circle cx="50" cy="50" r="33" stroke="#d97706" strokeWidth="3" fill="#0f172a" fillOpacity="0.08" />
        
        {/* Wheel Hub Center */}
        <circle cx="50" cy="50" r="14" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill="#f59e0b" />

        {/* 6 Precision Machine Spokes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <path
              d="M48 35 L45 20 L55 20 L52 35 Z"
              fill="#d97706"
              opacity="0.9"
            />
            {/* Precision Lug Nut */}
            <circle cx="50" cy="27" r="2.2" fill="#e2e8f0" stroke="#0f172a" strokeWidth="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WheelLogo;
