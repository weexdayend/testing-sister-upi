// app/components/FullScreenLoader.tsx

"use client"; // To use client-side rendering features, like animations

import React from 'react';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default FullScreenLoader;
