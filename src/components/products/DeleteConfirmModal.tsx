'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: number) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    if (isDeleting) return; // Prevent double trigger
    try {
      setIsDeleting(true);
      await onConfirm(product.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 text-center">
        
        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4 border border-rose-200 dark:border-rose-800">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Delete Product?
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{product.title}"</span>? This action will remove the item from your current product listing.
        </p>

        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
