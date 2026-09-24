'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { getProductById } from '@/api/productService';
import { Product } from '@/types/product';
import {
  ArrowLeft,
  Star,
  Tag,
  PackageCheck,
  Truck,
  ShieldCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  User,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailContent({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setIsNotFound(false);
    setError(null);

    getProductById(productId)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.thumbnail || data.images?.[0] || '');
      })
      .catch((err: any) => {
        console.error('Failed to fetch product detail:', err);
        if (err.response?.status === 404) {
          setIsNotFound(true);
        } else {
          setError(
            err.response?.data?.message || 'Could not load product details. Please try again.'
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium animate-pulse">Loading product specification...</p>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4 border border-rose-200 dark:border-rose-800">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          We couldn't find any product with ID <span className="font-mono font-bold text-gray-700 dark:text-gray-300">"{productId}"</span>. It might have been removed or the URL is invalid.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products Listing</span>
        </Link>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Unable to Load Product
        </h2>
        <p className="text-gray-500 text-sm mb-6">{error || 'An unexpected error occurred.'}</p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to All Products</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm mb-8">
        
        {/* Left Column: Image Preview & Gallery Thumbnails */}
        <div className="space-y-4">
          <div className="w-full h-80 sm:h-96 rounded-xl bg-gray-100 dark:bg-gray-700/50 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center p-4">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://dummyjson.com/image/400x400/e0e0e0/666666?text=No+Preview';
              }}
            />
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === imgUrl
                      ? 'border-blue-600 ring-2 ring-blue-500/20 scale-105'
                      : 'border-gray-200 dark:border-gray-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Rating Row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                <Tag className="w-3 h-3 mr-1" />
                {product.category}
              </span>

              <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating ? product.rating.toFixed(1) : 'N/A'} / 5.0</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              {product.title}
            </h1>

            {product.brand && (
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Brand: <span className="font-semibold text-gray-800 dark:text-gray-200">{product.brand}</span>
              </p>
            )}

            {/* Price section */}
            <div className="flex items-baseline space-x-3 mb-6 bg-gray-50 dark:bg-gray-750 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 ? (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                  {product.discountPercentage.toFixed(1)}% OFF
                </span>
              ) : null}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quick Spec Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-750 p-2.5 rounded-lg">
                <PackageCheck className="w-4 h-4 text-blue-500" />
                <span>Stock: <strong className="text-gray-900 dark:text-white">{product.stock} units</strong></span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-750 p-2.5 rounded-lg">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>{product.shippingInformation || 'Standard Shipping'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-750 p-2.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>{product.warrantyInformation || '1 Year Warranty'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-750 p-2.5 rounded-lg">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>{product.returnPolicy || '30-Day Return'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Customer Reviews ({product.reviews.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                        {rev.reviewerName}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {new Date(rev.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" />
                    {rev.rating} / 5
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <ProtectedRoute>
      <ProductDetailContent params={params} />
    </ProtectedRoute>
  );
}
