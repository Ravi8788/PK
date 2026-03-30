import { createBrowserRouter } from 'react-router';
import PublicSite from '@/app/pages/PublicSite';
import AdminLogin from '@/app/pages/AdminLogin';
import AdminDashboard from '@/app/pages/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicSite,
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
]);
