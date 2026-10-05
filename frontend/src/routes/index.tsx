import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminRoute } from '@/routes/AdminRoute';
import { PageLoader } from '@/components/shared/PageLoader';

// Lazy load all pages for optimal bundle splitting
const HomePage = lazy(() => import('@/pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const ComponentShowcasePage = lazy(() => import('@/pages/ComponentShowcase/ComponentShowcasePage').then((m) => ({ default: m.ComponentShowcasePage })));
const ListingPage = lazy(() => import('@/pages/Listing/ListingPage').then((m) => ({ default: m.ListingPage })));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('@/pages/Cart/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const CheckoutSuccessPage = lazy(() => import('@/pages/Checkout/CheckoutSuccessPage').then((m) => ({ default: m.CheckoutSuccessPage })));
const OrdersPage = lazy(() => import('@/pages/Orders/OrdersPage').then((m) => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('@/pages/Orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const AccountLayout = lazy(() => import('@/pages/Account/AccountLayout').then((m) => ({ default: m.AccountLayout })));
const ProfilePage = lazy(() => import('@/pages/Account/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AddressesPage = lazy(() => import('@/pages/Account/AddressesPage').then((m) => ({ default: m.AddressesPage })));
const WishlistPage = lazy(() => import('@/pages/Account/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const SellerRegisterPage = lazy(() => import('@/pages/Seller/SellerRegisterPage').then((m) => ({ default: m.SellerRegisterPage })));

// Admin Pages
const DashboardPage = lazy(() => import('@/pages/Admin/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const AdminProductsPage = lazy(() => import('@/pages/Admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })));
const AdminOrdersPage = lazy(() => import('@/pages/Admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage })));
const AdminCategoriesPage = lazy(() => import('@/pages/Admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })));
const AdminUsersPage = lazy(() => import('@/pages/Admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })));
const AdminCouponsPage = lazy(() => import('@/pages/Admin/AdminCouponsPage').then((m) => ({ default: m.AdminCouponsPage })));

// Error Pages
const NotFoundPage = lazy(() => import('@/pages/Error/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'components',
        element: withSuspense(ComponentShowcasePage),
      },
      {
        path: 'category/:slug',
        element: withSuspense(ListingPage),
      },
      {
        path: 'search',
        element: withSuspense(ListingPage),
      },
      {
        path: 'product/:slug',
        element: withSuspense(ProductDetailPage),
      },
      {
        path: 'cart',
        element: withSuspense(CartPage),
      },
      {
        path: 'checkout',
        element: withSuspense(CheckoutPage),
      },
      {
        path: 'checkout/success',
        element: withSuspense(CheckoutSuccessPage),
      },
      {
        path: 'orders',
        element: withSuspense(OrdersPage),
      },
      {
        path: 'orders/:id',
        element: withSuspense(OrderDetailPage),
      },
      {
        path: 'seller',
        element: <Navigate to="/seller/register" replace />,
      },
      {
        path: 'seller/register',
        element: withSuspense(SellerRegisterPage),
      },
      {
        path: 'account',
        element: withSuspense(AccountLayout),
        children: [
          {
            index: true,
            element: <Navigate to="/account/profile" replace />,
          },
          {
            path: 'profile',
            element: withSuspense(ProfilePage),
          },
          {
            path: 'addresses',
            element: withSuspense(AddressesPage),
          },
          {
            path: 'wishlist',
            element: withSuspense(WishlistPage),
          },
        ],
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
      {
        path: 'forgot-password',
        element: withSuspense(ForgotPasswordPage),
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: withSuspense(DashboardPage),
          },
          {
            path: 'products',
            element: withSuspense(AdminProductsPage),
          },
          {
            path: 'orders',
            element: withSuspense(AdminOrdersPage),
          },
          {
            path: 'categories',
            element: withSuspense(AdminCategoriesPage),
          },
          {
            path: 'users',
            element: withSuspense(AdminUsersPage),
          },
          {
            path: 'coupons',
            element: withSuspense(AdminCouponsPage),
          },
          {
            path: '*',
            element: withSuspense(NotFoundPage),
          },
        ],
      },
    ],
  },
]);
