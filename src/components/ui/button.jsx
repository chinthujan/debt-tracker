import React from 'react';

export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}
