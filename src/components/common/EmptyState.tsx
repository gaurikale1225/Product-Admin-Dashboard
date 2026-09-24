'use client';

import React from 'react';
import { PackageSearch, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No products found',
  message = 'We couldn\'t find any products matching your search query or selected filter criteria.',
  onResetFilters,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center my-4 shadow-sm">
      <div className="w-16 h-16 bg-blue-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center text-blue-500 dark:text-blue-400 mx-auto mb-4 border border-blue-100 dark:border-gray-600">
        <PackageSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">{message}</p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
