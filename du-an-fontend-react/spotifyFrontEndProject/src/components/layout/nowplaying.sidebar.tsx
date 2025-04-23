import { useCurrentApp } from "../context/app.context";
import { usePlayer } from "../context/player.context";

const NowPlayingSidebar = () => {
    const { currentTrack } = usePlayer();
    const { showNowPlayingSideBar, setShowNowPlayingSideBar } = useCurrentApp();
    if (!currentTrack || !showNowPlayingSideBar) return null;

    return (
        <aside className="w-[340px] p-4 bg-zinc-990 text-white border-l border-zinc-800 relative">
            <div className="bg-zinc-900">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => setShowNowPlayingSideBar(false)}
                >
                    <i className="fa fa-times" />
                </button>

                <img src={currentTrack.image_url} className="w-full rounded mb-4" />
                <h2 className="text-lg font-bold">{currentTrack.title}</h2>
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
            </div>
        </aside>
    );
};

export default NowPlayingSidebar;