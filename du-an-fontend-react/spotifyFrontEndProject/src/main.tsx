import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './layout.tsx';
import LoginPage from './pages/client/login.tsx';
import HomePage from './pages/home.tsx';
import RegisterPage from './pages/client/register.tsx';
import './styles/global.scss'
import { App, Divider } from 'antd';
import { AppProvider } from './components/context/app.context.tsx';
import ProtectedRoute from './components/auth/index.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },

    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <div>Checkout Page</div>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <div>Admin page</div>
      </ProtectedRoute>
    )
  }

]);

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>,
)
