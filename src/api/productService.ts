import axiosInstance from './axiosInstance';
import {
  Product,
  ProductListResponse,
  ProductQueryParams,
  CategoryItem,
  ProductFormData,
} from '@/types/product';

/**
 * Fetch products list with pagination, search, category filter, and sorting.
 * Note: DummyJSON API has separate endpoints for search (/products/search) and category (/products/category/:category).
 * Accepts AbortSignal to cancel outdated requests during rapid debounced typing.
 */
export const getProducts = async (
  params: ProductQueryParams,
  signal?: AbortSignal
): Promise<ProductListResponse> => {
  const { limit, skip, search, category, sortBy, order } = params;

  let url = '/products';
  const queryParams: Record<string, string | number> = {
    limit,
    skip,
  };

  // Add sorting params if specified
  if (sortBy) {
    queryParams.sortBy = sortBy;
    if (order) queryParams.order = order;
  }

  if (search && search.trim() !== '') {
    url = '/products/search';
    queryParams.q = search.trim();
  } else if (category && category.trim() !== '') {
    url = `/products/category/${encodeURIComponent(category.trim())}`;
  }

  const response = await axiosInstance.get<ProductListResponse>(url, {
    params: queryParams,
    signal,
  });

  return response.data;
};

/**
 * Fetch list of all product categories.
 * Endpoint: GET /products/categories
 */
export const getCategories = async (): Promise<CategoryItem[]> => {
  const response = await axiosInstance.get('/products/categories');
  
  // DummyJSON returns array of category objects or string array depending on API version
  // Transform strings to CategoryItem format if needed
  if (Array.isArray(response.data)) {
    return response.data.map((cat: any) => {
      if (typeof cat === 'string') {
        return {
          slug: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
          url: `https://dummyjson.com/products/category/${cat}`,
        };
      }
      return cat;
    });
  }
  
  return [];
};

/**
 * Fetch a single product by ID.
 * Endpoint: GET /products/:id
 */
export const getProductById = async (id: number | string): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/products/${id}`);
  return response.data;
};

/**
 * Add a new product (Simulated by DummyJSON).
 * Endpoint: POST /products/add
 */
export const addProduct = async (productData: ProductFormData): Promise<Product> => {
  const response = await axiosInstance.post<Product>('/products/add', {
    ...productData,
  });
  return response.data;
};

/**
 * Update an existing product (Simulated by DummyJSON).
 * Endpoint: PUT /products/:id
 */
export const updateProduct = async (
  id: number,
  productData: Partial<ProductFormData>
): Promise<Product> => {
  const response = await axiosInstance.put<Product>(`/products/${id}`, productData);
  return response.data;
};

/**
 * Delete a product (Simulated by DummyJSON).
 * Endpoint: DELETE /products/:id
 */
export const deleteProduct = async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};
