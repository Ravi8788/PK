import { createElement, lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { createBrowserRouter } from 'react-router';

const PublicSite = lazy(() => import('@/app/pages/PublicSite'));
const AdminLogin = lazy(() => import('@/app/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('@/app/pages/AdminDashboard'));

function screen(Component: LazyExoticComponent<ComponentType>) {
  return function RouteScreen() {
    return createElement(
      Suspense,
      { fallback: createElement('div', { className: 'min-h-screen bg-black' }) },
      createElement(Component),
    );
  };
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: screen(PublicSite),
  },
  {
    path: '/admin/login',
    Component: screen(AdminLogin),
  },
  {
    path: '/admin',
    Component: screen(AdminDashboard),
  },
]);
