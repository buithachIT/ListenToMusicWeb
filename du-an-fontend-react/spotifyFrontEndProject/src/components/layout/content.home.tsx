import 'simplebar-react/dist/simplebar.min.css';
import { getTopArtistAPI, getTrackAPI } from '../../services/api';
import { useEffect, useState } from 'react';
import { usePlayer } from '../context/player.context';
import SimpleBar from 'simplebar-react';
const HomeContent = () => {
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
    console.log("Check artist>>>>>>>>>", listArtist);
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
    console.log(listTrack)

    const { setCurrentTrack, setIsPlaying } = usePlayer();
    const handleClickTrack = (track: ITrack) => {
        setCurrentTrack(track);
        setIsPlaying(true)
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
                <SimpleBar forceVisible="x" autoHide={false}>
                    <div className="flex gap-4 px-2">
                        {listTrack.map((item) => (
                            <div
                                onClick={() => handleClickTrack(item)}
                                key={item.track_id}
                                className="relative flex-none w-40 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded"
                            >
                                {/* ✅ Premium badge */}
                                {item.is_copyright && (
                                    <span className="absolute top-1 left-1 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                        <i className="fa-solid fa-crown fa-2x text-yellow-400"></i>
                                    </span>
                                )}

                                <img src={item.image_url} className="w-full h-40 object-cover rounded" />
                                <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                                <p className="text-xs text-gray-400">{item.price}</p>
                            </div>
                        ))}
                    </div>

                </SimpleBar>

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

                    </div > </SimpleBar>
            </div>
        </div>
    );
}
export default HomeContent;