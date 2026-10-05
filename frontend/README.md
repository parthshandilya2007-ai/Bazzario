# Bazaario — Indian Multi-Category E-Commerce Marketplace

A full-featured, responsive, production-ready e-commerce marketplace frontend built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **TanStack Query**, **Zustand**, and **Recharts**.

---

## 🎨 Design System Tokens

Bazaario follows a cohesive, premium Indian e-commerce design language:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **`primary`** | `#282A66` | Deep Indian indigo for branding, headers, primary buttons, footers |
| **`accent`** | `#FF6B4A` | Warm coral for CTAs, discounts, active tabs, price highlights |
| **`success`** | `#12855F` | Forest green for ratings, delivery milestones, order confirmation |
| **`background`** | `#F7F6F3` | Warm off-white page background |
| **`surface`** | `#FFFFFF` | Pure white cards, drawer sheets, modal dialogs |
| **`border`** | `#E6E3DD` | Soft warm neutral dividing lines and card borders |
| **`text-primary`** | `#1A1A1F` | Near-black high-contrast body & heading typography |
| **`text-muted`** | `#6B6B77` | Neutral gray for secondary metadata, MRP strikethrough |

- **Typography**: Google Font `Plus Jakarta Sans` (weights 400, 500, 600, 700, 800)
- **Border Radii**: Cards (`12px`), Inputs (`8px`), Pills (`999px`)
- **Rupee Pricing**: Indian formatting (`₹` symbol, bold final price, muted strikethrough MRP)
- **Ratings**: Green pill with solid white star and review count

---

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS with custom tokens & design system utilities
- **Server State & Caching**: TanStack Query (React Query) v5
- **Client State**: Zustand (Auth store, UI store, Cart drawer, Toast store)
- **Routing**: React Router v6 (Data Router with `React.lazy()` code splitting)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Revenue trend area charts, order status donut charts)
- **HTTP Client**: Axios with interceptors and graceful mock fallbacks

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/                   # Typed API service hooks (Categories, Products, Cart, Orders, Admin)
│   ├── components/
│   │   ├── shared/            # Reusable marketplace components (ProductCard, ProductRail, etc.)
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CategoryTile.tsx
│   │   │   ├── DiscountBadge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── FilterAccordionItem.tsx
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── PageLoader.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── PriceRangeSlider.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductRail.tsx
│   │   │   ├── RatingPill.tsx
│   │   │   ├── SortDropdown.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatusPill.tsx
│   │   │   ├── Stepper.tsx
│   │   │   └── TrustStripItem.tsx
│   │   └── ui/                # Base primitives (button, input, skeleton, toast)
│   ├── layouts/               # CustomerLayout, AdminLayout, AuthLayout
│   ├── lib/                   # Axios client, currency/date formatters, mock data, utils
│   ├── pages/
│   │   ├── Account/           # ProfilePage, AddressesPage, WishlistPage, AccountLayout
│   │   ├── Admin/             # DashboardPage, AdminProductsPage, AdminOrdersPage, Categories, Users, Coupons
│   │   ├── Auth/              # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── Cart/              # CartPage
│   │   ├── Checkout/          # CheckoutPage, CheckoutSuccessPage
│   │   ├── ComponentShowcase/ # Interactive design system showcase (/components)
│   │   ├── Error/             # NotFoundPage (404), ServerErrorPage (500)
│   │   ├── Home/              # HomePage
│   │   ├── Listing/           # ListingPage (category & search)
│   │   └── ProductDetail/     # ProductDetailPage
│   ├── routes/                # Router with React.lazy code splitting and AdminRoute guard
│   ├── store/                 # Zustand stores (useAuthStore, useUIStore)
│   ├── types/                 # TypeScript domain interfaces
│   ├── App.tsx                # App root with QueryClient, Toaster, ErrorBoundary
│   └── main.tsx               # DOM mount point
├── index.html                 # App HTML template with Plus Jakarta Sans
├── tailwind.config.js         # Design token configuration
├── vite.config.ts             # Vite build & manual chunking config
└── package.json
```

---

## 🗺️ Route Map

### Customer Routes
- `/` — Homepage (Hero carousel, trust strip, category grid, trending rails, explore catalog)
- `/components` — Design system & UI component showcase
- `/category/:slug` — Category listing with filters & sorting
- `/search?q=...` — Product search results
- `/product/:slug` — Product detail page (gallery, specs, pin-code delivery check, reviews)
- `/cart` — Full shopping bag & coupon application
- `/checkout` — Multi-step checkout (Address selection → Payment → Place Order)
- `/checkout/success` — Order confirmation & tracking details
- `/orders` — Order history with status filters
- `/orders/:id` — Order tracking detail with 5-stage timeline

### Customer Account Routes
- `/account/profile` — User profile details
- `/account/addresses` — Saved delivery addresses management
- `/account/wishlist` — Saved wishlist items

### Authentication Routes
- `/login` — Email/Password & Instant Phone OTP login with demo shortcuts
- `/register` — Customer & Seller registration
- `/forgot-password` — Password reset request

### Admin Portal (`/admin/*`)
- `/admin` — KPI StatCards, Recharts 7-day revenue area chart, order distribution donut chart, low stock alerts
- `/admin/products` — Product catalog management, supplier review, approve/reject moderation, slide-over creation drawer
- `/admin/orders` — Order fulfillment table with CSV export and status updates
- `/admin/categories` — Marketplace category hierarchy tree
- `/admin/users` — User directory with role and status toggles
- `/admin/coupons` — Promotional discount coupons manager

### Error Routes
- `*` — Brand-styled 404 Not Found page with category suggestions and search bar

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Environment Variables
Copy the `.env.example` file:
```bash
cp .env.example .env
```

### 4. Development Server
```bash
npm run dev
```
The app will start at `http://localhost:3000`.

### 5. Production Build & Verification
```bash
npm run build
```
Vite splits vendor dependencies (`react-vendor`, `recharts-vendor`, `query-vendor`, `icons-vendor`) and dynamically loads routes on demand, ensuring tiny initial load times.
