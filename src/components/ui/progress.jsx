import React from 'react';

export function Progress({ value, className = '', ...props }) {
  return (
    <div className={`w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-4 bg-green-500 transition-all duration-500"
        style={{ width: `${value}%` }}
        {...props}
      />
    </div>
  );
}
