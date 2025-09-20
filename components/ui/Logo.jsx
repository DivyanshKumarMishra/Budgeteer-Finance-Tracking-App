import React from 'react';

function Logo({ className = '', label = 'Budgeteer', ...props }) {
  return (
    <div className={`flex items-center space-x-1 ${className}`} {...props}>
      {/* Icon container */}
      <div className="flex items-center space-x-1 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 via-teal-400 to-blue-300 p-1 justify-center">
        <span className="text-white font-bold text-xl">₹</span>
      </div>

      {/* Logo text */}
      <h3 className="poppins-bold text-2xl md:text-3xl bg-gradient-to-r from-green-400 via-teal-400 to-blue-300 bg-clip-text text-transparent">
        {label}
      </h3>
    </div>
  );
}

export default Logo;
