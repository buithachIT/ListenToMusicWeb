import 'simplebar-react/dist/simplebar.min.css';
import { getTrackAPI } from '../../services/api';
import { useEffect, useState } from 'react';
import { usePlayer } from '../context/player.context';

const HomeContent = () => {
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
        <>
            <div className="space-y-10" >
                {/* Header */}
                < div className="flex justify-between items-center" >
                    <h1 className="text-2xl font-bold">Popular SONGS</h1>
                    <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div >

                {/* Albums */}
                < div className="grid grid-cols-6 gap-4" >
                    {listTrack.map((item) => {
                        return (
                            <div key={item.track_id} className="cursor-pointer hover:bg-[#1a1a1a] p-2 rounded"
                                onClick={() => handleClickTrack(item)}>
                                <img src={item.image_url} alt={item.title} className="rounded mb-2" />
                                <h3 className="text-sm font-semibold">{item.title}</h3>
                                <p className="text-xs text-gray-400">{item.price}</p>
                            </div>)
                    })}
                </div >
            </div >

            {/* POPULAR SINGER */}
            <div className="space-y-10 mt-6 mb-0" >
                {/* Header */}
                < div className="flex justify-between items-center" >
                    <h1 className="text-2xl font-bold">Popular SINGER</h1>
                    <button className="text-sm text-gray-400 hover:underline">Show all</button>
                </div >

                {/* Albums */}
                < div className="grid grid-cols-6 mt-5 gap-4" >
                    {listTrack.map((item) => {
                        return (
                            <div key={item.track_id} className="cursor-pointer hover:bg-[#1a1a1a] p-2 rounded"
                                onClick={() => handleClickTrack(item)}>
                                <img src={item.image_url} alt={item.title} className="rounded mb-2" />
                                <h3 className="text-sm font-semibold">{item.title}</h3>
                                <p className="text-xs text-gray-400">{item.price}</p>
                            </div>)
                    })}
                </div >
            </div >
        </>
    );
}
export default HomeContent;