import { Input, Modal } from "antd";
import { useState } from "react";

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("playlist");
    const staticItems = [
        { name: "Bài hát đã thích", icon: "fa-heart", subtitle: "Danh sách phát • 6 bài hát" },
        { name: "Hay nghe", icon: "fa-music", subtitle: "Danh sách phát • Thach" },
        { name: "Duzme Music", icon: "fa-user", subtitle: "Nghệ sĩ" },
        { name: "Mùa Đông Của Anh - Remake", icon: "fa-music", subtitle: "Danh sách phát • Thach" },
    ];

    const handleOk = () => {

    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }
    return (
        <>
            <aside className="h-full text-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Playlist của bạn</h2>
                    <button className="text-sm bg-white text-black rounded-full px-2 py-0.5 font-semibold"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}>
                        + Tạo playlist
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-3">
                    <button onClick={() => setActiveTab("playlist")} className={`px-3 py-1 rounded-full text-sm ${activeTab === "playlist" ? "bg-white text-black" : "bg-zinc-800"}`}>Danh sách phát</button>
                    <button onClick={() => setActiveTab("artist")} className={`px-3 py-1 rounded-full text-sm ${activeTab === "artist" ? "bg-white text-black" : "bg-zinc-800"}`}>Nghệ sĩ</button>
                    <button onClick={() => setActiveTab("album")} className={`px-3 py-1 rounded-full text-sm ${activeTab === "album" ? "bg-white text-black" : "bg-zinc-800"}`}>Album</button>
                </div>

                {/* List items */}
                <div className="overflow-y-auto flex-1 space-y-2 mt-2 pr-2">
                    {staticItems.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center p-2 hover:bg-zinc-800 rounded cursor-pointer">
                            <div className="w-10 h-10 bg-zinc-700 rounded shadow flex items-center justify-center">
                                <i className={`fa-solid ${item.icon}`} />
                            </div>
                            <div>
                                <div className="text-sm font-medium truncate">{item.name}</div>
                                <div className="text-xs text-gray-400 truncate">{item.subtitle}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <Modal title="Tạo playlist" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input

                    placeholder="Tên danh sách phát"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4"
                />

            </Modal>
        </>
    );
};

export default Sidebar;
