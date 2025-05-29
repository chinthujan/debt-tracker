import React from 'react';

export function Input(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className ?? ''}`}
    />
  );
}
