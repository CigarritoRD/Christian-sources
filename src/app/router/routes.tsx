// src/app/router/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import GuestRoute from '@/app/router/GuestRoute'
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminLayout from '@/components/layout/Adminlayout'

// Guards
import ProtectedRoute from '@/app/router/ProtectedRoute'
import AdminRoute from '@/app/router/AdminRoute'

// Public pages
import HomePage from '@/pages/public/Home'
import ResourcesPage from '@/pages/public/ResourcesPage'
import ResourceDetailPage from '@/pages/public/ResourceDetailPage'
import ContributorsPage from '@/pages/public/ContributorsPage'
import ContributorDetailPage from '@/pages/public/ContributorDetailPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import NotFoundPage from '@/pages/public/NotFoundPage'

// User pages
import DashboardHomePage from '@/pages/dashboard/DashboardHomePage'
import DashboardResourcesPage from '@/pages/dashboard/DashboardResourcesPage'
import DashboardLibraryPage from '@/pages/dashboard/DashboardLibraryPage'
import DashboardDownloadsPage from '@/pages/dashboard/DashboardDownloadsPage'
import DashboardProfilePage from '@/pages/dashboard/DashboardProfilePage'

// Admin pages


import AdminCategoryEditPage from '@/pages/admin/AdminCategoryEditPage'
import AdminResourcesPage from '@/pages/admin/AdminResourcesPage'
import AdminResourceCreatePage from '@/pages/admin/AdminResourceCreatePage'
import AdminResourceEditPage from '@/pages/admin/AdminResourceEditPage'
import AdminContributorsPage from '@/pages/admin/AdminContributorsPage'
import AdminContributorCreatePage from '@/pages/admin/AdminResourceCreatePage'
import AdminContributorEditPage from '@/pages/admin/AdminContributorEditPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminCategoryCreatePage from '@/pages/admin/AdminCreateCategoryPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: 'resources', element: <ResourcesPage /> },
      { path: 'resources/:slug', element: <ResourceDetailPage /> },

      { path: 'contributors', element: <ContributorsPage /> },
      { path: 'contributors/:slug', element: <ContributorDetailPage /> },

      {
        element: <GuestRoute />,
        children: [
          {
            children: [
              {
                path: '/login',
                element: <LoginPage />,
              },
              {
                path: '/register',
                element: <RegisterPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: 'resources', element: <DashboardResourcesPage /> },
      { path: 'library', element: <DashboardLibraryPage /> },
      { path: 'downloads', element: <DashboardDownloadsPage /> },
      { path: 'profile', element: <DashboardProfilePage /> },

    ],
  },

  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },

      { path: 'resources', element: <AdminResourcesPage /> },
      { path: 'resources/new', element: <AdminResourceCreatePage /> },
      { path: 'resources/:id/edit', element: <AdminResourceEditPage /> },

      { path: 'contributors', element: <AdminContributorsPage /> },
      { path: 'contributors/new', element: <AdminContributorCreatePage /> },
      { path: 'contributors/:id/edit', element: <AdminContributorEditPage /> },


      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'categories/new', element: <AdminCategoryCreatePage /> },
      { path: 'categories/:id/edit', element: <AdminCategoryEditPage /> },
    ],
  },

  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])