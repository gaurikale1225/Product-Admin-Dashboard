export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Meta;
  images: string[];
  thumbnail: string;
  // Flag for client-side local overrides
  isLocal?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface ProductQueryParams {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  brand: string;
  thumbnail: string;
}
