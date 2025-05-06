import 'simplebar-react/dist/simplebar.min.css';
import { getPlaylistTracksAPI } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/player.context';
import SimpleBar from 'simplebar-react';
import { useCurrentApp } from '../context/app.context';
import { Alert, Spin } from 'antd';
import '../../styles/global.scss';

interface PlaylistContentProps {
    playlistId: number;
    playlistName: string;
}

const PlaylistContent = ({ playlistId, playlistName }: PlaylistContentProps) => {
    const [trackResults, setTrackResults] = useState<ITrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch playlist tracks
    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getPlaylistTracksAPI(playlistId);
                if (res.data) {
                    setTrackResults(res.data);
                }
            } catch (error) {
                console.error('Error fetching playlist tracks:', error);
                setError('An error occurred while loading the playlist. Please try again.');
                setTrackResults([]);
            }
            setLoading(false);
        };

        fetchPlaylistTracks();
    }, [playlistId]);

    const { setShowNowPlayingSideBar, user, openModalPremium, setOpenModalPremium } = useCurrentApp();
    const { setCurrentTrack, setIsPlaying, setCurrentIndex, setPlayList } = usePlayer();

    const handleClickTrack = (track: ITrack, index: number) => {
        if (!track) return;

        if (track.is_copyright && !user?.is_superuser) {
            setOpenModalPremium(true);
            return;
        }
        setPlayList(trackResults);
        setCurrentTrack(track);
        setIsPlaying(true);
        setCurrentIndex(index);
        setShowNowPlayingSideBar(true);
    };

    const formatNumber = (num: number | undefined): string => {
        if (num === undefined) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Scroll functionality
    const tracksScrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className='bg-gradient-to-b from-[#191919] to-[#000] pt-5 pl-6'>
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            )}

            {/* Playlist Header */}
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-white">
                    {playlistName}
                </h1>
                <p className="text-gray-400">
                    {trackResults.length} tracks
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {/* Tracks Section */}
                    {trackResults.length > 0 && (
                        <div className="mb-8">
                            <div className="relative">
                                <SimpleBar forceVisible="x" autoHide={false} scrollableNodeProps={{ ref: tracksScrollRef }}>
                                    <div className="grid grid-cols-5 gap-4 px-2">
                                        {trackResults.map((item, index) => (
                                            <div
                                                onClick={() => handleClickTrack(item, index)}
                                                key={item.track_id}
                                                className="relative flex-none cursor-pointer hover:bg-[#1a1a1a] p-2 rounded group"
                                            >
                                                {item.is_copyright && (
                                                    <span className="absolute top-1 left-1 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                                        <i className="fa-solid fa-crown text-yellow-400 drop-shadow-md"></i>
                                                    </span>
                                                )}
                                                <img src={item.image_url} className="w-full aspect-square object-cover rounded" alt={item.title} />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                                    <i className="fa-solid fa-play text-white text-3xl opacity-0 group-hover:opacity-100 transition-all duration-300"></i>
                                                </div>
                                                <div className="mt-2">
                                                    <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                                                    <p className="text-xs text-gray-400 truncate">{item.artist?.name}</p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center">
                                                            <i className="fa-solid fa-headphones-simple text-xs text-gray-400 mr-1"></i>
                                                            <span className="text-xs text-gray-400">{formatNumber(item.listen)}</span>
                                                        </div>
                                                        {item.price && (
                                                            <span className="text-xs text-gray-400">${item.price}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </SimpleBar>
                                {trackResults.length > 5 && (
                                    <>
                                        <button
                                            onClick={() => scrollLeft(tracksScrollRef)}
                                            className="absolute left-0 z-10 bg-black/60 text-white p-2 rounded-full top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <i className="fa fa-chevron-left" />
                                        </button>
                                        <button
                                            onClick={() => scrollRight(tracksScrollRef)}
                                            className="absolute right-0 z-10 bg-black/60 text-white p-2 rounded-full top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <i className="fa fa-chevron-right" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* No Results Message */}
                    {trackResults.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            No tracks in this playlist
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PlaylistContent; 