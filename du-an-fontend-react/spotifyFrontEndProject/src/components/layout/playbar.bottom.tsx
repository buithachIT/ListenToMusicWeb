import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/player.context';
import { useCurrentApp } from '../context/app.context';

const PlayerBar = () => {
    const { user } = useCurrentApp();
    const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, currentIndex, setCurrentIndex, playlist, setPlayList } = usePlayer();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState(1);
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

    //Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume])

    if (!currentTrack) return (
        <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-r from-zinc-900 to-black border-t border-gray-800 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <i className="fa fa-music text-zinc-600 text-xl"></i>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-sm font-medium">Chưa chọn bài hát nào</p>
                    <p className="text-xs text-zinc-500">Chọn một bài hát để bắt đầu nghe nhạc</p>
                </div>
            </div>
        </div>
    );

    const urlTrack = `${import.meta.env.VITE_BACKEND_URL}/public/music_file/${encodeURIComponent(currentTrack.namemp3)}`

    //format duration
    const formatTime = (seconds: number): string => {
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
        return `${minutes}:${paddedSeconds}`;
    };

    const handleNext = () => {
        let nextIndex = currentIndex + 1;
        const endpoint = playlist.length;
        while (nextIndex < playlist.length) {
            if (nextIndex == endpoint) {
                nextIndex = 0;
                continue;
            }
            const nextTrack = playlist[nextIndex];
            if (nextTrack.is_copyright && !user?.is_superuser) {
                nextIndex++;
                continue;
            } else {
                // Nếu bài thường -> phát
                setCurrentIndex(nextIndex);
                setCurrentTrack(nextTrack);
                setIsPlaying(true);
                return;
            }
        }
        // Reset về bài đầu tiên nếu đã hết playlist
        nextIndex = 0;
        const firstTrack = playlist[nextIndex];
        if (!firstTrack.is_copyright || user?.is_superuser) {
            setCurrentIndex(nextIndex);
            setCurrentTrack(firstTrack);
            setIsPlaying(true);
            return;
        }
        // Nếu hết bài để phát
        setIsPlaying(false);
    };
    const handleShuffle = () => {
        const shuffledPlaylist = [...playlist];

        // Shuffle
        for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
        }


        const currentTrackId = currentTrack?.track_id;

        const newIndex = shuffledPlaylist.findIndex(track => track.track_id === currentTrackId);

        setPlayList(shuffledPlaylist);
        setCurrentIndex(newIndex);
        setCurrentTrack(shuffledPlaylist[newIndex]);
        setIsPlaying(true);

    };

    const handleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const handlePrevious = () => {
        const preIndex = currentIndex - 1;
        if (preIndex < playlist.length) {
            setCurrentIndex(preIndex);
            setCurrentTrack(playlist[preIndex]);
            setIsPlaying(true);
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-gray-800 flex items-center justify-between px-6 z-50 text-white">
            <audio ref={audioRef} src={urlTrack} onLoadedMetadata={() => setIsAudioReady(true)} onTimeUpdate={() => {
                setCurrentTime(audioRef.current?.currentTime || 0);
                ;
            }} onEnded={handleNext} />
            {/* --- Left: Song Info --- */}
            <div className="flex items-center space-x-4 w-1/3">
                <img
                    src={currentTrack.image_url}
                    alt="Song Cover"
                    className="w-14 h-14 rounded"
                />
                <div>
                    <div className="text-sm font-semibold truncate">{currentTrack.title}</div>
                    <div className="text-xs text-gray-400">{currentTrack.artist.name}</div>
                </div>
            </div>

            {/* --- Center: Player Controls --- */}
            <div className="flex flex-col items-center w-1/3">
                <div className="flex space-x-4 items-center">
                    <button className="text-gray-400 hover:text-white" onClick={handleShuffle}>
                        <i className="fa fa-random" />
                    </button>
                    <button className="text-gray-400 hover:text-white" onClick={handlePrevious}>
                        <i className="fa fa-step-backward" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(prev => !prev)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black"
                    >
                        <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                    </button>

                    <button className="text-gray-400 hover:text-white" onClick={handleNext}>
                        <i className="fa fa-step-forward" />
                    </button>
                    <button className="text-gray-400 hover:text-white" onClick={handleRepeat}>
                        <i className="fa fa-repeat" />
                    </button>
                </div>
                <div className="flex items-center space-x-2 text-xs w-full mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={audioRef.current?.duration}
                        value={currentTime}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setCurrentTime(value);
                            if (audioRef.current) {
                                audioRef.current.currentTime = value;
                            }
                        }}
                        className="w-full h-1 accent-white"
                    />
                    <span>{formatTime(audioRef.current?.duration || 0)}</span>
                </div>
            </div>

            {/* --- Right: Extra Controls --- */}
            <div className="flex items-center space-x-4 justify-end w-1/3">
                <div className="relative group  flex">
                    <button className="text-gray-400 mr-2" onClick={() => {
                        if (volume > 0) {
                            setPreviousVolume(volume);
                            setVolume(0);               // Mute
                        } else {
                            setVolume(previousVolume); // Unmute
                        }
                    }}>
                        <i className={`fa ${volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'}`} />
                    </button>
                    {/* Slider volume  */}
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="transition-all duration-200 h-1 mt-2.5 accent-amber-50"
                    />
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
