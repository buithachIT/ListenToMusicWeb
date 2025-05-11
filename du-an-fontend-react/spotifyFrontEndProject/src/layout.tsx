import AppHeader from "./components/layout/app.header";
import { useCurrentApp } from "./components/context/app.context";
import { PacmanLoader } from "react-spinners";
import HomePage from "./pages/client/home";
import SearchPage from "./pages/client/search";
import ArtistPage from "./pages/client/artist";
import PlayerBar from "./components/layout/playbar.bottom";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/client/login";
import RegisterPage from "./pages/client/register";
import PlaylistPage from "./pages/client/playlist";

function Layout() {
  const { isAppLoading } = useCurrentApp();

  return (
    <>
      {isAppLoading === false ? (
        <div className="flex flex-col h-screen relative">
          {/* Header */}
          <AppHeader />

          {/* Content */}
          <div className="flex flex-1 overflow-hidden pb-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/artist/:artistId/:artistName" element={<ArtistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/playlist/:playlistId/:playlistName" element={<PlaylistPage />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)"
        }}>
          <PacmanLoader size={30} />
        </div>
      )}
      <PlayerBar />
    </>
  );
}

export default Layout;
