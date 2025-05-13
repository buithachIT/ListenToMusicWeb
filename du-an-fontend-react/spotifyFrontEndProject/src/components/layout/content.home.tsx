import 'simplebar-react/dist/simplebar.min.css';
import { getAllTracksAPI, getTopArtistAPI, getTrackAPI } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/player.context';
import SimpleBar from 'simplebar-react';
import { useCurrentApp } from '../context/app.context';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.scss';

const HomeContent = () => {
    const navigate = useNavigate();
    const [showAllTracks, setShowAllTracks] = useState(false);
    const [showAllArtists, setShowAllArtists] = useState(false);

    //render top artist
    const [listArtist, setListArtist] = useState<IArtist[]>([]);
    useEffect(() => {
        fetchArtist();
    }, []);

    const fetchArtist = async () => {
        const res = await getTopArtistAPI();
        if (res.data) {
            setListArtist(res.data);
        }
    }

    //Render tracks
    const [listTrack, setListTrack] = useState<ITrack[]>([]);

    useEffect(() => {
        fetchTrack();
    }, [])

    const fetchTrack = async () => {
        const res = await getTrackAPI();
        if (res.data) {
            setListTrack(res.data);
        }
    }

    const handleGetAllTracks = async () => {
        if (!showAllTracks) {
            const res = await getAllTracksAPI();
            if (res.data) {
                setListTrack(res.data);
            }
        } else {
            fetchTrack(); // Reset to initial tracks
        }
        setShowAllTracks(!showAllTracks);
    }

    const handleGetAllArtists = () => {
        setShowAllArtists(!showAllArtists);
    }

    const { setShowNowPlayingSideBar, user, openModalPremium, setOpenModalPremium } = useCurrentApp();
    const { setCurrentTrack, setIsPlaying, setCurrentIndex, setPlayList } = usePlayer();
    const handleClickTrack = (track: ITrack, index: number) => {
        if (track.is_copyright && !user?.is_superuser == true) {
            setOpenModalPremium(true);
            return;
        }
        setPlayList(listTrack);
        setCurrentTrack(track);
        setIsPlaying(true);
        setCurrentIndex(index);
        setShowNowPlayingSideBar(true);
    }

    //Scroll 
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
    };

    //handle open/close Premium modal
    const handleCancelPremium = () => {
        setOpenModalPremium(false);
    }
    const handleOkPremium = () => {
        navigate('/premium-checkout')
    }

    const handleArtistClick = (artist: IArtist) => {
        navigate(`/artist/${artist.artist_id}/${encodeURIComponent(artist.name)}`);
    };

    return (
        <div className='bg-gradient-to-b from-[#191919] to-[#000] pt-5 pl-6'>

            {/* <div className="flex gap-2 mb-5">
                <button className="bg-white text-black font-semibold px-4 py-1 rounded-full">
                    Tất cả
                </button>
                <button className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full hover:bg-[#3a3a3a]">
                    Âm nhạc
                </button>
                <button className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full hover:bg-[#3a3a3a]">
                    Podcasts
                </button>
            </div> */}
            <div>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Popular SONGS</h1>
                    <button
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-bold text-xs mr-3 flex items-center gap-1"
                        onClick={handleGetAllTracks}
                    >
                        {showAllTracks ? "Show less" : "Show all"}
                        <i className={`fa fa-chevron-${showAllTracks ? 'up' : 'down'} text-xs transition-transform duration-200`}></i>
                    </button>
                </div>
                <div className="relative mt-4">
                    <SimpleBar forceVisible="x" autoHide={false} scrollableNodeProps={{ ref: scrollRef }}>
                        <div className={`flex gap-4 px-2 ${showAllTracks ? 'flex-wrap' : ''}`}>
                            {listTrack.map((item, index) => (
                                <div
                                    onClick={() => handleClickTrack(item, index)}
                                    key={item.track_id}
                                    className={`group relative cursor-pointer hover:bg-[#1a1a1a] p-3 rounded transition-all duration-200 ${showAllTracks ? 'w-48' : 'w-40 flex-none'}`}
                                >
                                    {(user?.is_superuser == 0) ?
                                        (
                                            (item.is_copyright == 1) && (
                                                <span className="absolute top-2 left-2 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                                    <i className="fa-solid fa-crown text-yellow-400 drop-shadow-md"></i>
                                                </span>
                                            )
                                        )
                                        :
                                        (
                                            (item.is_copyright == 1) && (
                                                <span className="absolute top-2 left-2 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                                    <i className="fa-solid fa-crown premium-text drop-shadow-md"></i>
                                                </span>
                                            )
                                        )
                                    }
                                    <div className="relative">
                                        <img src={item.image_url} className="w-full h-40 object-cover rounded shadow-lg transition-transform duration-200 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded flex items-center justify-center">
                                            <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                                                <i className="fa fa-play text-black"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold truncate mt-2">{item.title}</h3>

                                </div>
                            ))}
                        </div>
                    </SimpleBar>
                    {!showAllTracks && (
                        <>
                            <button
                                onClick={scrollLeft}
                                className="absolute left-0 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full top-1/2 -translate-y-1/2 shadow-lg transition-all duration-200 hover:scale-110"
                            >
                                <i className="fa fa-chevron-left" />
                            </button>
                            <button
                                onClick={scrollRight}
                                className="absolute right-0 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full top-1/2 -translate-y-1/2 shadow-lg transition-all duration-200 hover:scale-110"
                            >
                                <i className="fa fa-chevron-right" />
                            </button>
                        </>
                    )}
                </div>
                {/* POPULAR SINGER */}
                <div className="flex gap-4 mt-8 justify-between overflow-x-auto pt-2">
                    <h1 className="text-2xl font-bold">Popular SINGER</h1>
                    <button
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-bold text-xs mr-3 flex items-center gap-1"
                        onClick={handleGetAllArtists}
                    >
                        {showAllArtists ? "Show less" : "Show all"}
                        <i className={`fa fa-chevron-${showAllArtists ? 'up' : 'down'} text-xs transition-transform duration-200`}></i>
                    </button>
                </div>
                <SimpleBar forceVisible="x" autoHide={false}>
                    <div className="space-y-10 mt-6 mb-5">
                        <div className={`grid ${showAllArtists ? 'grid-cols-6' : 'grid-cols-6'} mt-5 gap-6`}>
                            {listArtist.map((item) => (
                                <div
                                    key={item.artist_id}
                                    onClick={() => handleArtistClick(item)}
                                    className="group cursor-pointer hover:bg-[#1a1a1a] p-4 rounded transition-all duration-200"
                                >
                                    <div className="relative">
                                        <img
                                            src={item.avatar}
                                            className="w-full aspect-square object-cover rounded-full mb-3 shadow-lg transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-full flex items-center justify-center">
                                            <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                                                <i className="fa fa-play text-black"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-center">{item.name}</h3>
                                    <div className='flex items-center justify-center gap-1 mt-1'>
                                        <p className="text-xs text-gray-400">{item.follower}</p>
                                        <i className="fa fa-fire text-orange-500" aria-hidden="true"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SimpleBar>
            </div>

            {/* Model premium */}
            <Modal
                open={openModalPremium}
                title={null}
                width={800}
                onCancel={handleCancelPremium}
                footer={[
                    <Button
                        key="checkout"
                        type="primary"
                        onClick={handleOkPremium}
                        className="bg-green-500 hover:bg-green-600 transition-colors duration-200"
                        size="large"
                    >
                        Khám phá Spotify Premium ngay!
                    </Button>,
                    <Button
                        key="cancel"
                        onClick={handleCancelPremium}
                        className="hover:bg-gray-100 transition-colors duration-200"
                    >
                        Hủy
                    </Button>,
                ]}
                className="premium-modal"
            >
                {/* Section 1 - Header Premium */}
                <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-8 rounded-t-lg text-3xl mb-4 font-bold">
                    <div className="flex items-center gap-3 mb-2">
                        <i className="fa-solid fa-crown text-yellow-400"></i>
                        <span>Bài nhạc này thuộc Premium!</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-8 rounded-b-lg">
                    <h2 className="text-2xl font-bold mb-3">59.000 ₫ cho 4 tháng dùng gói Premium</h2>
                    <p className="mb-6 text-gray-100">Tận hưởng trải nghiệm nghe nhạc không quảng cáo, không cần kết nối mạng và nhiều lợi ích khác. Hủy bất cứ lúc nào.</p>
                    <div className="flex gap-4 mb-6">
                        <Button
                            type="default"
                            className="font-bold hover:bg-white/10 transition-colors duration-200"
                            size="large"
                        >
                            Dùng thử 4 tháng với giá 59.000 ₫
                        </Button>
                    </div>
                    <p className="text-xs text-gray-200">
                        Chỉ áp dụng cho gói Premium Individual. Ưu đãi kết thúc vào ngày 19 tháng 5, 2025.
                        <br />
                        <a href="#" className="underline text-white hover:text-gray-200 transition-colors duration-200">Có áp dụng điều khoản</a>
                    </p>
                </div>
                {/* Section 2 - Payment Methods */}
                <div className="bg-white p-8 rounded-b-lg">
                    <h3 className="text-lg font-semibold mb-3">Gói hợp túi tiền cho mọi hoàn cảnh</h3>
                    <p className="text-gray-600 mb-6">Chọn một gói Premium để nghe nhạc không quảng cáo thỏa thích trên mọi thiết bị. Hủy bất cứ lúc nào.</p>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600">Thanh toán online cực nhanh chóng với</p>
                        <img src="/momo-2.svg" alt="momo" width={70} height={32} className="hover:opacity-80 transition-opacity duration-200" />
                    </div>
                </div>
            </Modal>

        </div >

    );
}
export default HomeContent;