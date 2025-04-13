const Sidebar = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-bold mb-4">
                <img src="./vite.svg" className="w-6 h-6" />

                <span>Spotify</span>
            </div>

            <button className="flex items-center space-x-2 text-white font-semibold">
                <span className="material-icons">home</span>
                <span>Home</span>
            </button>

            <div className="mt-6">
                <h2 className="text-sm uppercase text-gray-400 mb-2">Your Library</h2>
                <div className="space-y-2 text-sm">
                    <div className="hover:bg-[#1a1a1a] p-2 rounded cursor-pointer">❤️ Liked Songs</div>
                    <div className="hover:bg-[#1a1a1a] p-2 rounded cursor-pointer">Hay nghe</div>
                    <div className="hover:bg-[#1a1a1a] p-2 rounded cursor-pointer">Duzme Music</div>
                    <div className="hover:bg-[#1a1a1a] p-2 rounded cursor-pointer">Mùa Đông Của Anh</div>
                    {/* ... thêm playlist khác */}
                </div>
            </div>
        </div>
    );
}
export default Sidebar;