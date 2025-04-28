import 'simplebar-react/dist/simplebar.min.css';
import { getTopArtistAPI, getTrackAPI } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/player.context';
import SimpleBar from 'simplebar-react';
import { useCurrentApp } from '../context/app.context';
import { Button, message, Modal, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.scss';
const HomeContent = () => {


    const navigate = useNavigate();


    //render top artist
    const [listArtist, setListArtist] = useState<IArtist[]>([])
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


    const { setShowNowPlayingSideBar, user, openModalPremium, setOpenModalPremium } = useCurrentApp();
    const { setCurrentTrack, setIsPlaying, setCurrentIndex, setPlayList } = usePlayer();
    console.log("Check premium>>", user)
    const handleClickTrack = (track: ITrack, index: number) => {
        if (track.is_copyright && !user?.is_superuser == 1) {
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
    const scrollRef = useRef<any>(null); // hoặc HTMLDivElement
    const scrollLeft = () => {
        scrollRef.current?.getScrollElement().scrollBy({ left: -300, behavior: 'smooth' });
    };
    const scrollRight = () => {
        scrollRef.current?.getScrollElement().scrollBy({ left: 300, behavior: 'smooth' });
    };


    //handle open/close Premium modal
    const handleCancelPremium = () => {
        setOpenModalPremium(false);
    }
    const handleOkPremium = () => {
        navigate('/premium-checkout')
    }

    return (
        <div className='bg-gradient-to-b from-[#191919] to-[#000] pt-5 pl-6'>

            <div className="flex gap-2 mb-5">
                <button className="bg-white text-black font-semibold px-4 py-1 rounded-full">
                    Tất cả
                </button>
                <button className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full hover:bg-[#3a3a3a]">
                    Âm nhạc
                </button>
                <button className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full hover:bg-[#3a3a3a]">
                    Podcasts
                </button>
            </div>


            <div>
                {/* Header */}
                < div className="flex justify-between items-center" >
                    <h1 className="text-2xl font-bold">Popular SONGS</h1>
                    <button className="text-sm text-gray-400 hover:underline font-bold text-xs mr-3">Show all</button>
                </div>
                <div className="relative">
                    <SimpleBar ref={scrollRef} forceVisible="x" autoHide={false}>

                        <div className="flex gap-4 px-2">
                            {listTrack.map((item, index) => (
                                <div
                                    onClick={() => handleClickTrack(item, index)}
                                    key={item.track_id}
                                    className="relative flex-none w-40 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded"
                                >
                                    {(user?.is_premium) ?
                                        (
                                            item.is_copyright && (
                                                <span className="absolute top-1 left-1 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                                    <i className="fa-solid fa-crown  text-yellow-400 drop-shadow-md"></i>
                                                </span>
                                            )
                                        )
                                        :
                                        (
                                            item.is_copyright && (
                                                <span className="absolute top-1 left-1 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                                    <i className="fa-solid fa-crown premium-text drop-shadow-md"></i>
                                                </span>
                                            )
                                        )
                                    }
                                    {/* Premium badge */}

                                    <img src={item.image_url} className="w-full h-40 object-cover rounded" />
                                    <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                                    <p className="text-xs text-gray-400">{item.price}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 z-10 bg-black/60 text-white p-2 rounded-full top-1/2 -translate-y-1/2"
                        >
                            <i className="fa fa-chevron-left" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 z-10 bg-black/60 text-white p-2 rounded-full top-1/2 -translate-y-1/2"
                        >
                            <i className="fa fa-chevron-right" />
                        </button>
                    </SimpleBar>
                </div>
                {/* POPULAR SINGER */}
                {/* Header */}
                <div className="flex gap-4 mt-5 justify-between overflow-x-auto pt-2">
                    <h1 className="text-2xl font-bold">Popular SINGER</h1>
                    <button className="text-sm text-gray-400 hover:underline font-bold text-xs mr-3">Show all</button>
                </div >
                <SimpleBar forceVisible="x" autoHide={false}>
                    <div className="space-y-10 mt-6 mb-5" >
                        {/* Albums */}
                        < div className="grid grid-cols-6 mt-5 gap-4" >
                            {listArtist.map((item) => {
                                return (
                                    <div key={item.artist_id} className="cursor-pointer hover:bg-[#1a1a1a] p-2 rounded mr-5">
                                        <img src={item.avatar} className="rounded-full mb-2" />
                                        <h3 className="text-sm font-semibold">{item.name}</h3>
                                        <div className='flex'><p className="text-xs text-gray-400">{item.follower}</p>
                                            <i className="fa fa-fire ml-1" aria-hidden="true"></i></div>
                                    </div>)
                            })}
                        </div >
                    </div >
                </SimpleBar>
            </div>

            {/* Model premium */}
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
                {/* Section 1 - Header Premium */}
                <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-6 rounded text-3xl mb-4 font-bold">Bài nhạc này thuộc Premium!</div>
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
                {/* Section 2 - Payment Methods */}
                <div className="bg-white p-6 rounded-b">
                    <h3 className="text-lg font-semibold mb-2">Gói hợp túi tiền cho mọi hoàn cảnh</h3>
                    <p className="text-gray-600 mb-4">Chọn một gói Premium để nghe nhạc không quảng cáo thỏa thích trên mọi thiết bị. Hủy bất cứ lúc nào.</p>
                    <div className="flex items-center gap-4">
                        <p>Thanh toán online cực nhanh chóng với</p>
                        <img src="/momo-2.svg" alt="momo" width={70} height={32} />
                    </div>
                </div>
            </Modal>

        </div>

    );
}
export default HomeContent;