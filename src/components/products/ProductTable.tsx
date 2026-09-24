'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Star, Eye, Edit3, Trash2, Tag, Layers } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const renderStockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          Out of Stock
        </span>
      );
    } else if (stock <= 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="hidden md:block w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="py-3.5 px-4">Product Info</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50/60 dark:hover:bg-gray-750/40 transition-colors group"
              >
                {/* Product Info (Image + Title + Brand) */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                      <img
                        src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          // Fallback broken image
                          (e.target as HTMLImageElement).src =
                            'https://dummyjson.com/image/150x150/e0e0e0/666666?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="max-w-xs">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 transition-colors"
                        title={product.title}
                      >
                        {product.title}
                      </Link>
                      {product.brand && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Brand: {product.brand}
                        </p>
                      )}
                      {product.isLocal && (
                        <span className="inline-block mt-0.5 text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 px-1.5 py-0.2 rounded font-medium">
                          Local Draft
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md capitalize">
                    <Tag className="w-3 h-3 mr-1 text-gray-400" />
                    {product.category}
                  </span>
                </td>

                {/* Price & Discount */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </div>
                  {product.discountPercentage && product.discountPercentage > 0 ? (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {product.discountPercentage.toFixed(1)}% OFF
                    </div>
                  ) : null}
                </td>

                {/* Rating Stars */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {product.rating ? product.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Stock Level Badge */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {renderStockBadge(product.stock)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
