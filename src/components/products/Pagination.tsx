'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  limit: number;
  skip: number;
  onPageChange: (newSkip: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  limit,
  skip,
  onPageChange,
  onLimitChange,
}) => {
  if (total === 0) return null;

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const startItem = total > 0 ? skip + 1 : 0;
  const endItem = Math.min(skip + limit, total);

  // Generate page numbers with ellipsis algorithm
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleSelectPage = (pageNumber: number) => {
    const newSkip = (pageNumber - 1) * limit;
    onPageChange(newSkip);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Items Range Info & Page Size Selector */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
        <div>
          Showing <span className="font-bold text-gray-900 dark:text-white">{startItem}-{endItem}</span> of{' '}
          <span className="font-bold text-gray-900 dark:text-white">{total}</span> items
        </div>

        <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4">
          <label htmlFor="pageSizeSelect" className="text-gray-500">
            Per page:
          </label>
          <select
            id="pageSizeSelect"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="py-1 px-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-xs text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <button
          onClick={() => handleSelectPage(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handleSelectPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 px-2 text-xs font-medium"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1 px-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handleSelectPage(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => handleSelectPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 px-2 text-xs font-medium"
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handleSelectPage(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
