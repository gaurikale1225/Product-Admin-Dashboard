'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductCardList } from '@/components/products/ProductCard';
import { Pagination } from '@/components/products/Pagination';
import { ProductModal } from '@/components/products/ProductModal';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { TableSkeleton, CardSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { getProducts, getCategories, addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '@/api/productService';
import { Product, CategoryItem, ProductFormData } from '@/types/product';
import { Info } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- URL Query State Extraction & Parsing ---
  const rawPage = searchParams.get('page');
  const rawLimit = searchParams.get('limit');
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'asc';

  // Sanitize numeric page and limit safely
  const parsedPage = parseInt(rawPage || '1', 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const parsedLimit = parseInt(rawLimit || '10', 10);
  const limit = [10, 20, 50].includes(parsedLimit) ? parsedLimit : 10;
  const skip = (page - 1) * limit;

  // --- Component State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for client-side CRUD overrides (Add, Edit, Delete)
  const [localCreatedProducts, setLocalCreatedProducts] = useState<Product[]>([]);
  const [localUpdatedProducts, setLocalUpdatedProducts] = useState<Record<number, Product>>({});
  const [localDeletedIds, setLocalDeletedIds] = useState<number[]>([]);

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Ref for request race condition cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to update URL params cleanly
  const updateQueryParams = useCallback(
    (newParams: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '' || value === 0) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch categories once on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch products whenever searchParams change
  const fetchProducts = useCallback(async () => {
    // Cancel previous pending request to avoid race condition
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getProducts(
        {
          limit,
          skip,
          search: searchQuery,
          category: selectedCategory,
          sortBy,
          order,
        },
        controller.signal
      );

      // Apply client-side modifications on returned server items
      let resultProducts = data.products.map((item) => {
        if (localUpdatedProducts[item.id]) {
          return { ...item, ...localUpdatedProducts[item.id] };
        }
        return item;
      });

      // Filter out deleted IDs
      resultProducts = resultProducts.filter((item) => !localDeletedIds.includes(item.id));

      // Append newly created local products on page 1 if search matches
      if (page === 1 && !selectedCategory && localCreatedProducts.length > 0) {
        const filteredLocals = localCreatedProducts.filter((loc) => {
          if (localDeletedIds.includes(loc.id)) return false;
          if (searchQuery) {
            return loc.title.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return true;
        });
        resultProducts = [...filteredLocals, ...resultProducts];
      }

      setProducts(resultProducts);
      setTotal(data.total);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        // Request cancelled due to newer search keystroke; ignore error silently
        return;
      }
      console.error('Fetch products error:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch products from DummyJSON API.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    limit,
    skip,
    page,
    searchQuery,
    selectedCategory,
    sortBy,
    order,
    localCreatedProducts,
    localUpdatedProducts,
    localDeletedIds,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Handlers ---
  const handleSearchChange = (newQuery: string) => {
    updateQueryParams({ search: newQuery, page: 1 });
  };

  const handleCategoryChange = (newCat: string) => {
    updateQueryParams({ category: newCat, search: '', page: 1 });
  };

  const handleSortChange = (newSortBy: string, newOrder: 'asc' | 'desc') => {
    updateQueryParams({ sortBy: newSortBy, order: newOrder, page: 1 });
  };

  const handlePageChange = (newSkip: number) => {
    const newPage = Math.floor(newSkip / limit) + 1;
    updateQueryParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams({ limit: newLimit, page: 1 });
  };

  const handleResetFilters = () => {
    router.push('/products');
  };

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setDeletingProduct(product);
  };

  // CRUD API Executions with Optimistic Local State Sync
  const handleSaveProduct = async (formData: ProductFormData) => {
    if (editingProduct) {
      // Edit mode
      try {
        const updated = await apiUpdateProduct(editingProduct.id, formData);
        const mergedProduct = { ...editingProduct, ...formData, ...updated };

        setLocalUpdatedProducts((prev) => ({
          ...prev,
          [editingProduct.id]: mergedProduct,
        }));

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? mergedProduct : p))
        );
      } catch (err) {
        // Fallback for custom local items
        const mergedProduct = { ...editingProduct, ...formData };
        setLocalUpdatedProducts((prev) => ({
          ...prev,
          [editingProduct.id]: mergedProduct,
        }));
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? mergedProduct : p))
        );
      }
    } else {
      // Add mode
      try {
        const created = await apiAddProduct(formData);
        const newProduct: Product = {
          ...created,
          id: Date.now(), // Generate unique temp ID for local list
          images: [formData.thumbnail],
          thumbnail: formData.thumbnail,
          isLocal: true,
        };

        setLocalCreatedProducts((prev) => [newProduct, ...prev]);
        setProducts((prev) => [newProduct, ...prev]);
        setTotal((prev) => prev + 1);
      } catch (err) {
        const newProduct: Product = {
          id: Date.now(),
          ...formData,
          images: [formData.thumbnail],
          thumbnail: formData.thumbnail,
          isLocal: true,
        };
        setLocalCreatedProducts((prev) => [newProduct, ...prev]);
        setProducts((prev) => [newProduct, ...prev]);
        setTotal((prev) => prev + 1);
      }
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await apiDeleteProduct(productId);
    } catch (err) {
      console.warn('API delete simulated:', err);
    } finally {
      setLocalDeletedIds((prev) => [...prev, productId]);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTotal((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Products Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your store's inventory, search items, and update stock details.
          </p>
        </div>
      </div>

      {/* Technical Note Banner explaining DummyJSON API behavior */}
      {searchQuery && selectedCategory && (
        <div className="mb-4 p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">API Notice:</span> DummyJSON API endpoints do not support combining <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">/products/search</code> and <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">/products/category</code> in a single endpoint. Active search performs a global search across all categories.
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        categories={categories}
        onOpenAddModal={handleOpenAddModal}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <>
          <TableSkeleton rows={limit > 10 ? 10 : limit} />
          <CardSkeleton count={4} />
        </>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState onResetFilters={handleResetFilters} />
      ) : (
        <>
          {/* Desktop Table View */}
          <ProductTable
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />

          {/* Mobile Card List View */}
          <ProductCardList
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />

          {/* Pagination Controls */}
          <Pagination
            total={total}
            limit={limit}
            skip={skip}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<TableSkeleton rows={8} />}>
        <ProductsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
