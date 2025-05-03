import { useState } from 'react';
import SimpleBar from "simplebar-react";
import HomeContent from "../../components/layout/content.home";
import Sidebar from "../../components/layout/sidebar";
import NowPlayingSidebar from "../../components/layout/nowplaying.sidebar";
import ChatBox from '../../components/layout/chatbox';
import { MessageOutlined } from '@ant-design/icons';

const HomePage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <div className="flex flex-1 overflow-hidden bg-black text-white">
                {/* Sidebar */}
                <aside className="w-80 bg-[#121212] overflow-auto rounded-lg p-4 ml-2 mr-2">
                    <Sidebar />
                </aside>
                {/* Main content */}
                <SimpleBar className="flex-1 h-full pr-6 overflow-y-auto">
                    <HomeContent />
                </SimpleBar>
                <NowPlayingSidebar />
            </div>

            {/* Chat button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-24 right-4 bg-[#1DB954] text-white p-3 rounded-full shadow-lg hover:bg-[#1ed760] transition-colors z-50"
            >
                <MessageOutlined className="text-xl" />
            </button>

            {/* Chat modal */}
            <ChatBox
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </>
    );
};

export default HomePage;