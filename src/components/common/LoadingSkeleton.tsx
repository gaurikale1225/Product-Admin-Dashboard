'use client';

import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded hidden md:block"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded hidden md:block"></div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3"
        >
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
