import AppHeader from "./components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "./services/api";
import { useCurrentApp } from "./components/context/app.context";
import { PacmanLoader } from "react-spinners";
import HomePage from "./pages/client/home";
import SearchPage from "./pages/client/search";
import PlayerBar from "./components/layout/playbar.bottom";
import { Routes, Route } from "react-router-dom";

function Layout() {
  const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } = useCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
    }
    fetchAccount();
  }, []);

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
