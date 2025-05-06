import 'simplebar-react/dist/simplebar.min.css';
import { useEffect, useState } from 'react';
import { usePlayer } from '../context/player.context';
import { useCurrentApp } from '../context/app.context';
import { Alert, Spin } from 'antd';
import '../../styles/global.scss';
import { getTracksByArtistAPI } from '../../services/api';

interface ArtistContentProps {
    artistId: number;
    artistName: string;
}

const ArtistContent = ({ artistId, artistName }: ArtistContentProps) => {
    const [trackResults, setTrackResults] = useState<ITrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch artist tracks
    useEffect(() => {
        const fetchArtistTracks = async () => {
            if (!artistId) {
                console.log('No artistId provided, skipping fetch');
                return;
            }

            console.log('Starting to fetch tracks for artistId:', artistId);
            setLoading(true);
            setError(null);
            try {
                const tracks = await getTracksByArtistAPI(artistId);
                console.log('Received tracks:', tracks);
                if (Array.isArray(tracks)) {
                    console.log('Setting tracks:', tracks);
                    setTrackResults(tracks);
                } else {
                    console.log('Invalid response format');
                    setTrackResults([]);
                }
            } catch (error) {
                console.error('Error fetching artist tracks:', error);
                setError('An error occurred while loading the artist tracks. Please try again.');
                setTrackResults([]);
            }
            setLoading(false);
        };

        fetchArtistTracks();
    }, [artistId]);

    const { setShowNowPlayingSideBar, user, setOpenModalPremium } = useCurrentApp();
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

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Artist Header */}
                    <div className="flex items-center gap-4">
                        <img
                            src={trackResults[0]?.artist?.avatar}
                            alt={artistName}
                            className="w-25 h-25 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{artistName}</h1>
                            <p className="text-gray-400">{trackResults.length} songs</p>
                        </div>
                    </div>

                    {/* Tracks List */}
                    <div className="space-y-2">
                        {trackResults.map((track, index) => (
                            <div
                                key={track.track_id}
                                onClick={() => handleClickTrack(track, index)}
                                className="flex items-center gap-4 p-2 rounded hover:bg-[#2a2a2a] cursor-pointer group"
                            >
                                <div className="w-12 h-12 relative">
                                    <img
                                        src={track.image_url}
                                        alt={track.title}
                                        className="w-full h-full object-cover rounded"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                        <button className="opacity-0 group-hover:opacity-100 bg-white text-black rounded-full p-2 transition-all duration-300">
                                            <i className="fa-solid fa-play"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{track.title}</h3>
                                    <p className="text-gray-400 text-sm">{track.artist.name}</p>
                                </div>
                                {track.is_copyright && (
                                    <span className="text-yellow-400">
                                        <i className="fa-solid fa-crown"></i>
                                    </span>
                                )}
                                <div className="text-gray-400 text-sm">
                                    {track.listen.toLocaleString()} <i className="fa-solid fa-headphones"></i>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistContent; 