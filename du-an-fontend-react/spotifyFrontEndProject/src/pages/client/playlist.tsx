import SimpleBar from "simplebar-react";
import PlaylistContent from "../../components/layout/content.playlist";
import Sidebar from "../../components/layout/sidebar";
import NowPlayingSidebar from "../../components/layout/nowplaying.sidebar";
import { useParams } from "react-router-dom";

const PlaylistPage = () => {
    const { playlistId, playlistName } = useParams();

    return (
        <>
            <div className="flex flex-1 overflow-hidden bg-black text-white">
                {/* Sidebar */}
                <aside className="w-80 bg-[#121212] overflow-auto rounded-lg p-4 ml-2 mr-2">
                    <Sidebar />
                </aside>
                {/* Main content */}
                <SimpleBar className="flex-1 h-full pr-6 overflow-y-auto">
                    <PlaylistContent
                        playlistId={Number(playlistId)}
                        playlistName={playlistName || 'Playlist'}
                    />
                </SimpleBar>
                <NowPlayingSidebar />
            </div>
        </>
    );
};

export default PlaylistPage; 