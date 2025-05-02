
import { useCurrentApp } from "../context/app.context";
import { App, Avatar, Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { logoutAPI } from "../../services/api";

const Navbar = () => {
    const { isAuthenticated, setIsAuthenticated, user, setUser, setOpenModalPremium } = useCurrentApp();
    const navigate = useNavigate();
    const { message } = App.useApp();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.message) {
            message.success(res.message);
            localStorage.removeItem("access_token");
            setIsAuthenticated(false);
            setUser(null);
        }
    }
    const items = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];
    if (user?.role_id == 1) {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/media/image_thumb/${user?.url_avatar}`;
    console.log("Check url>>", urlAvatar);
    return (
        <nav className="flex justify-between items-center px-4 py-3 bg-black text-white">
            {/* Left section */}
            <div className="flex items-center space-x-4">

                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                    alt="Spotify"
                    className="w-7 h-7"
                />

                {/* Home icon */}
                <div className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 2a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L16 10.414V17a1 1 0 01-1 1h-4v-4H9v4H5a1 1 0 01-1-1v-6.586l-.293.293a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 2z" />
                    </svg>
                </div>

                {/* Search bar */}
                <div className="flex items-center bg-zinc-800 rounded-full px-4 py-1 w-72">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="What do you want to play?"
                        className="bg-transparent text-white text-sm w-full focus:outline-none"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
                {user?.is_superuser == 1
                    ?
                    <div><div className="relative inline-flex items-center gap-2 text-1xl font-extrabold premium-text">
                        Premium
                    </div>
                        <i className="fa-solid fa-crown text-yellow-400 drop-shadow-md premium-text ml-2 animate-bounce"></i>
                        <style>
                            {`
                                .premium-text {
                                    background: linear-gradient(
                                    270deg,
                                    #ff0000, #ff9900, #ffff00, #33ff00, #00ffff, #3300ff, #cc00ff, #ff0000
                                    );
                                    background-size: 400% 400%;
                                    -webkit-background-clip: text;
                                    -webkit-text-fill-color: transparent;
                                    animation: gradientMove 8s ease infinite;
                                }

                                @keyframes gradientMove {
                                    0% { background-position: 0% 50%; }
                                    50% { background-position: 100% 50%; }
                                    100% { background-position: 0% 50%; }
                                }
                            `}
                        </style>
                    </div>
                    :

                    < button className="bg-white text-black text-sm font-semibold px-4 py-1 rounded-full" onClick={() => { setOpenModalPremium(true) }}>
                        Explore Premium
                    </button>
                }
                <div className="flex items-center space-x-1 text-sm text-gray-200 cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 16l4-5h-3V4h-2v7H8z" />
                        <path d="M20 18H4v2h16z" />
                    </svg>
                    <span className="font-bold">Install App</span>
                </div>
                <div className="relative cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                {!isAuthenticated ?
                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                    :
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Space >
                            <Avatar src={urlAvatar} />
                            <p>Xin chào, {user?.fullname}</p>
                        </Space>
                    </Dropdown>}
            </div>
        </nav >
    );
};

export default Navbar;
