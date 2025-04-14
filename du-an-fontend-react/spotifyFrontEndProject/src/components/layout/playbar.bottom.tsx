import { useEffect, useRef, useState } from 'react';
import { getTrackAPI } from '../../services/api';

const PlayerBar = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const togglePlay = () => {
        if (!isPlaying) {
            audioRef.current.pause();
        }
        else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }



    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-gray-800 flex items-center justify-between px-6 z-50 text-white">
            <audio ref={audioRef} src="/music_file/abc.mp3" />
            {/* --- Left: Song Info --- */}
            <div className="flex items-center space-x-4 w-1/3">
                <img
                    src="https://i.scdn.co/image/ab67616d00001e0206d6ca0ec5edd42245e72ea3"
                    alt="Song Cover"
                    className="w-14 h-14 rounded"
                />
                <div>
                    <div className="text-sm font-semibold truncate">Tình Ca Tình Ta</div>
                    <div className="text-xs text-gray-400">kis</div>
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
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black"
                    >
                        <i className={`fa ${!isPlaying ? 'fa-pause' : 'fa-play'}`} />
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
