'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductFormData, CategoryItem } from '@/types/product';
import { X, Loader2, Save, PackagePlus, Edit } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  initialProduct?: Product | null;
  categories: CategoryItem[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  categories,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    rating: 4.5,
    brand: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        title: initialProduct.title || '',
        description: initialProduct.description || '',
        category: initialProduct.category || '',
        price: initialProduct.price || 0,
        stock: initialProduct.stock || 0,
        rating: initialProduct.rating || 4.5,
        brand: initialProduct.brand || '',
        thumbnail: initialProduct.thumbnail || initialProduct.images?.[0] || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories.length > 0 ? categories[0].slug : 'beauty',
        price: 19.99,
        stock: 50,
        rating: 4.5,
        brand: 'Generic',
        thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      });
    }
    setErrors({});
  }, [initialProduct, isOpen, categories]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.price === undefined || formData.price === null || isNaN(formData.price)) {
      newErrors.price = 'Price is required';
    } else if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.stock === undefined || formData.stock === null || isNaN(formData.stock)) {
      newErrors.stock = 'Stock count is required';
    } else if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple rapid clicks

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save product. Please check network connection.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              {initialProduct ? <Edit className="w-4 h-4" /> : <PackagePlus className="w-4 h-4" />}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errors.form && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
              {errors.form}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border ${
                errors.title ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'
              } rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Brand Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border ${
                  errors.category ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none capitalize`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony, Apple, Nike"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Price & Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border ${
                  errors.price ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border ${
                  errors.stock ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Image Thumbnail URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write detailed product specifications and features..."
              className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border ${
                errors.description ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'
              } rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialProduct ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
