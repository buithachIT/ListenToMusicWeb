import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/player.context';

const PlayerBar = () => {
    const { currentTrack, isPlaying, setIsPlaying } = usePlayer();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    useEffect(() => {
        setIsAudioReady(false);
    }, [currentTrack]);
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isAudioReady) return;

        if (isPlaying) {
            audio.play().catch(err => {
                console.warn("Play error:", err);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, isAudioReady]);

    if (!currentTrack) return (
        <div className="fixed bottom-0 left-0 w-full h-20 bg-zinc-900 flex items-center justify-center text-white text-sm italic">
            Chưa chọn bài hát nào
        </div>
    );
    const urlTrack = `${import.meta.env.VITE_BACKEND_URL}/media/music_file/${encodeURIComponent(currentTrack.namemp3)}`


    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-gray-800 flex items-center justify-between px-6 z-50 text-white">
            <audio ref={audioRef} src={urlTrack} onLoadedMetadata={() => setIsAudioReady(true)} />
            {/* --- Left: Song Info --- */}
            <div className="flex items-center space-x-4 w-1/3">
                <img
                    src={currentTrack.image_url}
                    alt="Song Cover"

                    className="w-14 h-14 rounded"
                />
                <div>
                    <div className="text-sm font-semibold truncate">{currentTrack.title}</div>
                    <div className="text-xs text-gray-400">{currentTrack.listen}</div>
                </div>
            </div>

            {/* --- Center: Player Controls --- */}
            <div className="flex flex-col items-center w-1/3">
                <div className="flex space-x-4 items-center">
                    <button className="text-gray-400 hover:text-white">
                        <i className="fa fa-random" />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                        <i className="fa fa-step-backward" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(prev => !prev)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black"
                    >
                        <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                    </button>

                    <button className="text-gray-400 hover:text-white">
                        <i className="fa fa-step-forward" />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                        <i className="fa fa-repeat" />
                    </button>
                </div>
                <div className="flex items-center space-x-2 text-xs w-full mt-1">
                    <span>0:00</span>
                    <div className="h-1 bg-gray-600 rounded w-full">
                        <div className="h-1 bg-white rounded w-1/3" />
                    </div>
                    <span>3:55</span>
                </div>
            </div>

            {/* --- Right: Extra Controls --- */}
            <div className="flex items-center space-x-4 justify-end w-1/3">
                <button className="text-gray-400 hover:text-white">
                    <i className="fa fa-volume-up" />
                </button>
                <div className="w-24 h-1 bg-gray-600 rounded">
                    <div className="h-1 bg-white rounded w-2/3" />
                </div>
                <button className="text-gray-400 hover:text-white">
                    <i className="fa fa-list" />
                </button>
                <button className="text-gray-400 hover:text-white">
                    <i className="fa fa-desktop" />
                </button>
            </div>

        </div>



    );
};

export default PlayerBar;
