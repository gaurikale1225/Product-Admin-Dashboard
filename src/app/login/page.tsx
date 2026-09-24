'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, KeyRound, Loader2, LogIn, AlertCircle, Sparkles } from 'lucide-react';

function LoginFormContent() {
  const [username, setUsername] = useState('gauri');
  const [password, setPassword] = useState('gauri123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/products';
  const isExpired = searchParams.get('expired') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await login({ username: username.trim(), password: password.trim() });
      router.push(redirectUrl);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid credentials. Please use username "gauri" and password "gauri123".');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('gauri');
    setPassword('gauri123');
    setError(null);
  };

  return (
    <div className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 z-10">
      {/* Header Branding */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Product Admin Login
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sign in to manage product catalog and inventory
        </p>
      </div>

      {/* Expired Session Alert */}
      {isExpired && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Your session expired or invalid token. Please log in again.</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (e.g. gauri)"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (e.g. gauri123)"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In to Dashboard</span>
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Box */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-900/60 rounded-xl p-3.5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Credentials
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
            >
              Auto-fill
            </button>
          </div>
          <div className="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              Username: <span className="font-bold text-gray-900 dark:text-white">gauri</span>
            </p>
            <p>
              Password: <span className="font-bold text-gray-900 dark:text-white">gauri123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
