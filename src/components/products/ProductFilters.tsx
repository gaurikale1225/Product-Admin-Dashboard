'use client';

import React, { useState, useEffect } from 'react';
import { CategoryItem } from '@/types/product';
import { Search, X, Filter, ArrowUpDown, Plus } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  order: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  categories: CategoryItem[];
  onOpenAddModal: () => void;
  onResetFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  order,
  onSortChange,
  categories,
  onOpenAddModal,
  onResetFilters,
}) => {
  // Local input state for smooth typing response before debouncing parent
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Keep local search synced when external searchQuery prop changes (e.g. via reset or URL update)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce logic: update parent search query after 400ms delay of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onSortChange('', 'asc');
      return;
    }
    const [field, sortOrder] = val.split('-');
    onSortChange(field, sortOrder as 'asc' | 'desc');
  };

  const currentSortValue = sortBy ? `${sortBy}-${order}` : '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Bar with Debounce */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products by title, brand, description..."
            className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & Controls Container */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          
          {/* Category Filter */}
          <div className="relative flex-1 sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-8 pr-7 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={currentSortValue}
              onChange={handleSortSelect}
              className="w-full pl-8 pr-7 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Sort By (Default)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {(searchQuery || selectedCategory || sortBy) && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Reset all search, filter, and sort options"
            >
              Reset
            </button>
          )}

          {/* Add Product Button */}
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
