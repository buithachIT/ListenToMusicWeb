import 'simplebar-react/dist/simplebar.min.css';
import { searchTracksAPI, searchByArtistAPI } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/player.context';
import SimpleBar from 'simplebar-react';
import { useCurrentApp } from '../context/app.context';
import { Button, Modal, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.scss';

interface SearchContentProps {
    searchQuery: string;
}

const SearchContent = ({ searchQuery }: SearchContentProps) => {
    const navigate = useNavigate();
    const [trackResults, setTrackResults] = useState<ITrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch search results
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;

            setLoading(true);
            setError(null);
            try {
                // Search in both tracks and tracks by artist
                const [tracksRes, artistTracksRes] = await Promise.all([
                    searchTracksAPI(searchQuery),
                    searchByArtistAPI(searchQuery)
                ]);

                // Combine and deduplicate results
                const allTracks = new Map();

                // Add tracks from regular search
                if (Array.isArray(tracksRes)) {
                    tracksRes.forEach(track => {
                        allTracks.set(track.track_id, track);
                    });
                }

                // Add tracks from artist search
                if (Array.isArray(artistTracksRes)) {
                    artistTracksRes.forEach(track => {
                        allTracks.set(track.track_id, track);
                    });
                }

                setTrackResults(Array.from(allTracks.values()));
            } catch (error) {
                console.error('Error searching:', error);
                setError('An error occurred while searching. Please try again.');
                setTrackResults([]);
            }
            setLoading(false);
        };

        fetchSearchResults();
    }, [searchQuery]);

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

    // Premium modal handlers
    const handleCancelPremium = () => {
        setOpenModalPremium(false);
    };

    const handleOkPremium = () => {
        navigate('/premium-checkout');
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

            {/* Search Results Header */}
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-white">
                    Search Results for "{searchQuery}"
                </h1>
                <p className="text-gray-400">
                    Found {trackResults.length} tracks
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
                                                <div className="relative">
                                                    {item.is_copyright && (
                                                        <span className="absolute top-1 left-1 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                                            <i className="fa-solid fa-crown text-yellow-400 drop-shadow-md"></i>
                                                        </span>
                                                    )}
                                                    <img src={item.image_url} className="w-full aspect-square object-cover rounded" alt={item.title} />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                                        <i className="fa-solid fa-play text-white text-3xl opacity-0 group-hover:opacity-100 transition-all duration-300"></i>
                                                    </div>
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
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </>
            )}

            {/* Premium Modal */}
            <Modal
                open={openModalPremium}
                title={null}
                width={800}
                onCancel={handleCancelPremium}
                footer={[
                    <Button key="checkout" type="primary" onClick={handleOkPremium}>
                        Khám phá Spotify Premium ngay!
                    </Button>,
                    <Button key="cancel" onClick={handleCancelPremium}>
                        Hủy
                    </Button>,
                ]}
            >
                <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-6 rounded text-3xl mb-4 font-bold">
                    Bài nhạc này thuộc Premium!
                </div>
                <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-6 rounded">
                    <h2 className="text-2xl font-bold mb-2">59.000 ₫ cho 4 tháng dùng gói Premium</h2>
                    <p className="mb-4">Tận hưởng trải nghiệm nghe nhạc không quảng cáo, không cần kết nối mạng và nhiều lợi ích khác. Hủy bất cứ lúc nào.</p>
                    <div className="flex gap-4 mb-4">
                        <Button type="default" className="font-bold">
                            Dùng thử 4 tháng với giá 59.000 ₫
                        </Button>
                    </div>
                    <p className="text-xs text-gray-200">
                        Chỉ áp dụng cho gói Premium Individual. Ưu đãi kết thúc vào ngày 19 tháng 5, 2025.
                        <br />
                        <a href="#" className="underline text-white">Có áp dụng điều khoản</a>
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default SearchContent; 