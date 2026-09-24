# Product Admin Dashboard (Mystore)

A production-grade, highly polished **Product Admin Dashboard** built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios**.

This project connects to the [DummyJSON API](https://dummyjson.com) to provide a complete inventory management workflow, written at a clean, maintainable, fresher-friendly codebase standard.

---

## 🚀 Technical Highlights & Features

### 🔐 1. Authentication & Route Guards
- **API Endpoint**: `POST https://dummyjson.com/auth/login`
- **Credentials**: Username `gauri` | Password `gauri123` *(also supports `emilys` / `emilyspass`)*
- **Session Management**: Auth tokens are stored in `localStorage` and automatically attached to every outgoing API request using an **Axios Request Interceptor**.
- **Route Guard**: The `ProtectedRoute` wrapper component blocks unauthenticated access to `/products` and `/products/[id]`, redirecting users to `/login`.
- **Double Click Protection**: Login button disables during authentication (`isSubmitting`) to prevent rapid duplicate login calls.

---

### 📦 2. Responsive Product Listing (Desktop Table + Mobile Cards)
- **Desktop**: Clean data table displaying Thumbnail Image, Title, Brand, Category tag, Price with Discount Badge, Star Rating visualization, Stock level pills, and Action buttons (View, Edit, Delete).
- **Mobile**: Responsive card grid optimized for touch interactions.
- **Loading State**: Animated skeleton loaders (`TableSkeleton`, `CardSkeleton`) during data fetches.
- **Empty State**: Visual empty result fallback with a "Reset Filters" action button when search or filter returns zero matches.
- **Error State**: Error alert with a functional "Retry Loading" button for network or API failures.

---

### 📄 3. Custom Pagination (Hand-crafted, No External Libraries)
- **API Pagination**: Uses `limit` and `skip` query parameters (e.g. `limit=10&skip=20`).
- **Controls**:
  - Previous / Next navigation buttons (disabled on first/last page).
  - First / Last page shortcuts.
  - Smart page number buttons with ellipsis algorithm (e.g. `1 2 3 ... 10`).
  - Page size dropdown options (`10`, `20`, `50`).
  - Dynamic info counter text: *"Showing 21-40 of 194 items"*.

---

### 🔍 4. Debounced Search & Race Condition Handling
- **Search Endpoint**: `/products/search?q=...`
- **Debouncing**: Waits 400ms after the user stops typing before triggering the API request.
- **Keystroke Reset**: Automatically resets back to page 1 (`skip=0`) when search query changes.
- **Race Condition Prevention**: Uses native `AbortController` attached to Axios. If a user types quickly, previous in-flight HTTP requests are automatically aborted so old slow responses **never** overwrite newer search results.

---

### 🏷️ 5. Category Filtering & Sorting
- **Categories**: Dynamic category list fetched from `GET /products/categories`.
- **Sorting**: Supports sorting by Price (low-to-high, high-to-low), Rating (highest first), and Title (A-Z, Z-A) via `sortBy` and `order` parameters.
- **URL Synchronization**: All filter, search, sort, page, and limit states are saved in the URL query string (`/products?page=1&search=phone&category=smartphones&sortBy=price&order=asc`).
- **URL Safety**: Malformed parameters (e.g. `?page=abc` or `?page=9999`) are safely sanitized to page `1` or clamped without crashing.

---

### 🛍️ 6. Product Details Page (`/products/[id]`)
- **Route**: `/products/[id]`
- **Features**: Interactive image thumbnail selector, full description, price & discount calculations, shipping/warranty/return specs, and customer reviews with reviewer details and star ratings.
- **Invalid ID Handling**: Custom 404 "Product Not Found" fallback UI with a direct link back to the product dashboard.

---

### 📝 7. Add, Edit, & Delete Modals
- **Form Validation**: Validates title (min 3 chars), category, positive price, stock counts, and description.
- **Double Click Safety**: Disables Save/Delete submit buttons (`isSubmitting` / `isDeleting`) during pending network calls.
- **Confirmation Popup**: Displays a confirmation modal before removing any product.

---

## 💡 Key Architectural Decisions & Explanations

### Q1: The API cannot search and filter by category at the same time. How does the app handle this?
> **Answer**: In DummyJSON API, `/products/search?q=...` and `/products/category/:category` are separate API endpoints. DummyJSON does not support combining both query parameters in a single backend request.
>
> **Our Solution**:
> 1. When a user enters a search term (`searchQuery`), the app prioritizes global product search across all categories via `/products/search?q=...`.
> 2. When search is cleared, the app switches to `/products/category/:category`.
> 3. An informative notice banner is displayed to the user when both search and category are active, clearly explaining how the API operates.

### Q2: Add, edit, and delete are not really saved by the DummyJSON API. How does the app display changes?
> **Answer**: DummyJSON returns mock HTTP 200/201 response objects for `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id`, but does not persist these changes in its backend database.
>
> **Our Solution**:
> The application uses **optimistic local state merging**:
> - Newly added products are given a temporary client ID and prepended to the active list (`localCreatedProducts`).
> - Edited products update a `localUpdatedProducts` dictionary mapped by product ID, which overrides server response fields.
> - Deleted products are stored in a `localDeletedIds` array and filtered out of the rendered list.
>
> This gives the administrator a real-time CRUD experience while correctly interfacing with the mock backend.

---

## 🛠️ Project Structure

```
src/
├── api/
│   ├── axiosInstance.ts      # Shared Axios setup with request/response interceptors & token auth
│   ├── authService.ts        # POST /auth/login and GET /auth/me
│   └── productService.ts     # CRUD & Search API methods with AbortSignal support
├── context/
│   └── AuthContext.tsx       # Authentication session management & login/logout state
├── types/
│   ├── product.ts            # Product, Category, Review & Query types
│   └── auth.ts               # AuthUser & Login credentials interfaces
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Top header navigation with user badge & logout button
│   │   └── ProtectedRoute.tsx# Client-side route guard wrapper
│   ├── products/
│   │   ├── ProductTable.tsx  # Desktop table view with status badges & rating stars
│   │   ├── ProductCard.tsx   # Mobile card grid layout
│   │   ├── ProductFilters.tsx# Debounced search input, category dropdown & sort selector
│   │   ├── Pagination.tsx    # Page navigation, page size selector & items range text
│   │   ├── ProductModal.tsx  # Form modal for Add / Edit Product with full validation
│   │   └── DeleteConfirmModal.tsx # Confirmation popup before deleting
│   └── common/
│       ├── LoadingSkeleton.tsx# Skeleton loader components
│       ├── ErrorState.tsx    # Error state component with Retry button
│       └── EmptyState.tsx    # Empty result component with Reset button
└── app/
    ├── layout.tsx            # App root layout with AuthProvider & Navbar
    ├── page.tsx              # Root landing page (redirects to /products or /login)
    ├── login/
    │   └── page.tsx          # Login page with validation & demo credentials auto-fill
    └── products/
        ├── page.tsx          # Main products dashboard page with full URL state sync
        └── [id]/
            └── page.tsx      # Product details page with image preview & customer reviews
```

---

## ⚡ How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**:
   Navigate to [http://localhost:3000](http://localhost:3000).

4. **Login Credentials**:
   - **Username**: `gauri`
   - **Password**: `gauri123`
   - *(Or click the "Auto-fill" button on the login screen!)*
