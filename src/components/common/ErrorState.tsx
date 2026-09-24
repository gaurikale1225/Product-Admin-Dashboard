'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message,
  onRetry,
}) => {
  return (
    <div className="w-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl p-6 text-center my-4">
      <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 dark:text-rose-300 max-w-md mx-auto mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
};
