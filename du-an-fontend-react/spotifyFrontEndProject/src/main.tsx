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
import { AlbumProvider } from './components/context/album.context.tsx';
import TableUser from './components/admin/user/table.user.tsx';
import TableTrack from './components/admin/track/table.track.tsx';
import TableSinger from './components/admin/singer/table.singer.tsx';
import enUS from 'antd/locale/en_US';
import SearchPage from './pages/client/search.tsx';
import PlaylistPage from './pages/client/playlist.tsx';
import ArtistPage from './pages/client/artist.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "/playlist/:playlistId/:playlistName",
        element: <PlaylistPage />
      },
      {
        path: "/artist/:artistId/:artistName",
        element: <ArtistPage />
      }
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
    ),
    children: [
      {
        path: "user",
        element: <TableUser />
      },
      {
        path: "track",
        element: <TableTrack />
      },
      {
        path: "singer",
        element: <TableSinger />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AlbumProvider>
        <PlayerProvider>
          <ConfigProvider locale={enUS}>
            <AppProvider>
              <RouterProvider router={router} />
            </AppProvider>
          </ConfigProvider>
        </PlayerProvider>
      </AlbumProvider>
    </App>
  </StrictMode >,
)
