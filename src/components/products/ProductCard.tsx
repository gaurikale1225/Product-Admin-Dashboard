'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Star, Eye, Edit3, Trash2, Tag } from 'lucide-react';

interface ProductCardProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCardList: React.FC<ProductCardProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        >
          <div>
            {/* Header: Thumbnail + Title & Category */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                <img
                  src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://dummyjson.com/image/150x150/e0e0e0/666666?text=No+Image';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${product.id}`}
                  className="font-bold text-gray-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                >
                  {product.title}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded capitalize">
                    <Tag className="w-3 h-3 mr-1 text-gray-400" />
                    {product.category}
                  </span>
                  <div className="flex items-center text-xs font-semibold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                    {product.rating ? product.rating.toFixed(1) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description snippet */}
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {product.description}
            </p>

            {/* Price & Stock info */}
            <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 dark:border-gray-750 mb-3 text-sm">
              <div>
                <span className="text-xs text-gray-400 block">Price</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Stock</span>
                <span
                  className={`font-semibold text-xs ${
                    product.stock > 10
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : product.stock > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-1">
            <Link
              href={`/products/${product.id}`}
              className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 px-3 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </Link>

            <button
              onClick={() => onEdit(product)}
              className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 px-3 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(product)}
              className="p-1.5 text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
