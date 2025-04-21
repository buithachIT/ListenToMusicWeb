import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './layout.tsx';

import './styles/global.scss'
import { App, ConfigProvider } from 'antd';
import { AppProvider } from './components/context/app.context.tsx';
import ProtectedRoute from './components/auth/index.tsx';

import HomePage from './pages/client/home.tsx';
import LoginPage from './pages/client/auth/login.tsx';
import RegisterPage from './pages/client/auth/register.tsx';
import LayoutAdmin from './components/layout/admin/layout.admin.tsx';
import { PlayerProvider } from './components/context/player.context.tsx';

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
        <LayoutAdmin />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <App>
      <PlayerProvider>
        <ConfigProvider >
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        </ConfigProvider>
      </PlayerProvider>
    </App>
  </StrictMode>,
)
