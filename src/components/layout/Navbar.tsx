'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Package, User, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/products" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Mystore <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">Admin</span>
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Product Inventory Management
              </p>
            </div>
          </Link>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user && (
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    @{user.username}
                  </p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg border border-rose-200 dark:border-rose-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              title="Log out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
