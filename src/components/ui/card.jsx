import React from 'react';

export function Card({ children, className }) {
  return (
    <div className={`shadow-md rounded-2xl p-6 bg-white dark:bg-gray-800 ${className ?? ''}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
