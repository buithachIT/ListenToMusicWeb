import { useRef, useState } from "react";
import { useCurrentApp } from "../context/app.context";
import { usePlayer } from "../context/player.context";
import SimpleBar from 'simplebar-react';
import { Form, FormProps, Input, message, Modal, Radio } from "antd";
import { useAlbum } from "../context/album.context";
import { addToPlaylistAPI } from "../../services/api";

type FieldType = {
    playlist_id: number;
    track_id: number;
}

const NowPlayingSidebar = () => {
    const [isOpenModalPlaylist, setIsOpenModalPlaylist] = useState(false);
    const { currentTrack, setIsPlaying } = usePlayer();
    const { showNowPlayingSideBar, setShowNowPlayingSideBar, user } = useCurrentApp();
    const { albums } = useAlbum();
    const [form] = Form.useForm();
    const [pendingTrackId, setPendingTrackId] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    if (!currentTrack || !showNowPlayingSideBar) return null;
    const handleAddToPlaylist = (track_id: number) => {
        setPendingTrackId(track_id);
        setIsOpenModalPlaylist(true);
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log("Check values>>", values)
        const { track_id, playlist_id } = values;
        const res = await addToPlaylistAPI(playlist_id, track_id);
        if (res.data) {
            message.success("Đã thêm bài hát vào playlist")
        }
    }

    const handleFullScreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
                setIsPlaying(false);
            }
        }
    }
    const mv_url = `${import.meta.env.VITE_BACKEND_URL}/media/mv_file/${currentTrack.mv_url}`;
    return (
        <>
            <Modal
                title="Thêm vào playlist"
                open={isOpenModalPlaylist}
                onOk={() => { form.submit() }}
                onCancel={() => { setIsOpenModalPlaylist(false); form.resetFields(); }}
                afterOpenChange={(open) => {
                    if (open && pendingTrackId !== null) {
                        form.setFieldsValue({ track_id: pendingTrackId });
                    }
                }}
            >
                <Form form={form} onFinish={onFinish}>
                    <Form.Item<FieldType> name="track_id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType> name="playlist_id">
                        <Radio.Group size="large">
                            {albums?.map((item) => (
                                <Radio.Button key={item.playlist_id} value={item.playlist_id}>
                                    {item.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>

            <SimpleBar className="w-[350px] max-h-screen p-4 bg-zinc-990 text-white border-l border-zinc-800 relative" autoHide={false}>
                <aside >

                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden group">
                        <button
                            onClick={handleFullScreen}
                            className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-80 z-40"
                        ><i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                        </button>
                        {/* Video hoặc Ảnh */}
                        {currentTrack.mv_url ? (
                            <video
                                ref={videoRef}
                                src={mv_url}
                                className="w-full h-full object-cover rounded-md z-10"
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                            ></video>
                        ) : (
                            <img
                                src={currentTrack.image_url}
                                alt={currentTrack.title}
                                className="w-full h-full object-cover z-10"
                            />
                        )}

                        {/* Overlay đen nhẹ */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>

                        {/* Thông tin bài hát */}
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white z-30">
                            <div className="text-lg font-bold">{currentTrack.title}</div>
                            <div className="text-sm opacity-80">{currentTrack.artist.name}</div>
                        </div>

                        {/* (Sau này Icon thêm vào playlist cũng nên để z-30 trở lên) */}
                    </div>



                    <div className="bg-zinc-900 flex mt-3 justify-center">

                        <div className="relative group" onClick={() => { handleAddToPlaylist(currentTrack?.track_id) }}>
                            <i className="fas fa-music"></i> <i className="fas fa-plus"></i>
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Thêm vào Playlist
                            </div>
                        </div>
                        <div className="relative group">
                            <i className="ml-5 fas fa-heart"></i>
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Thêm vào danh sách yêu thích
                            </div>
                        </div>
                        {(user?.is_superuser) ? <div className="relative group ml-5" onClick={() => { handleAddToPlaylist(currentTrack?.track_id) }}>
                            <i className="fas fa-download premium-text"></i>
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Tải MV
                            </div>
                        </div>
                            :
                            <div className="relative group ml-5" onClick={() => { handleAddToPlaylist(currentTrack?.track_id) }}>
                                <i className="fas fa-download"></i> <i className="relative bottom-2 right-2 fas fa-crown fa-xs text-yellow-400 "></i>
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    Tải MV
                                </div>
                            </div>
                        }

                    </div>
                    <div className="lyrics mt-5 ">
                        <p className="font-bold">
                            Lyrics: <br /></p>
                        <p>
                            Em đi mất rồi, còn anh ở lại …<br />
                            Người giờ còn đây không? Thuyền này còn liệu sang sông?<br />
                            Buổi chiều dài mênh mông, lòng người giờ hòa hay đông<br />
                            Hồng mắt em cả bầu trời đỏ hoen<br />
                            Ta như đứa trẻ ngây thơ, quên đi tháng ngày ngu ngơ<br />
                            Người là ngàn mây bay, mình là giọt sầu chia tay<br />
                            Người cạn bầu không say, còn mình giãi bày trong đây<br />
                            Này gió ơi, đừng vội vàng, lắng nghe được không?<br />
                            <br />
                            Gió ơi xin đừng lấy em đi<br />
                            Hãy mang em về chốn xuân thì<br />
                            Ngày nào còn bồi hồi tóc xanh<br />
                            Ngày nào còn trò chuyện vớ anh<br />
                            Em nói em thương anh mà<br />
                            Nói em yêu em mà<br />
                            Cớ sao ta lại hóa chia xa<br />
                            Đóa phong lan lặng lẽ mơ màng<br />
                            Nàng dịu dàng tựa đèn phố Vinh<br />
                            Đẹp rạng ngời chẳng cần cố Xinh<br />
                            Hạt ngọc rơi rớt trên mái nhà, sau luống cà, và thế là …<br />
                            Xa nhau, xa nhau, thôi thì nỗi nhớ hà cớ gì người mang? Woo..<br />
                            <br />
                            Bên nhau không lâu, như là người thấy tờ giấy này nghìn trang …<br />
                            Vậy hãy để màu nắng phiêu du, phiêu du trên đỉnh đầu<br />
                            Và sẽ nói em nghe, em nghe, câu chuyện này là…<br />
                            Cả bầu trời vàng, đỏ, tím, xanh xanh<br />
                            Thuở thiếu niên thời tay nắm tay, cành lá me vàng ôm đắm say<br />
                            Nhẹ nhàng lá rơi, đọng lại vấn vương ven đường<br />
                            <br />
                            Gió ơi xin đừng lấy em đi<br />
                            Hãy mang em về chốn xuân thì<br />
                            Ngày nào còn bồi hồi tóc xanh<br />
                            Ngày nào còn trò chuyện vớ anh<br />
                            Em nói em thương anh mà<br />
                            Nói em yêu em mà<br />
                            Cớ sao ta lại hóa chia xa<br />
                            Đóa phong lan lặng lẽ mơ màng<br />
                            Nàng dịu dàng tựa đèn phố Vinh<br />
                            Đẹp rạng ngời chẳng cần cố Xinh<br />
                            Yêu em nhiều<br /><br />

                            Lòng này nhói đau, thương em nhiều, cạn tình biển sâu<br />
                            Biển sâu anh hát<br />
                            Nếu có ước muốn ngược thời gian<br />
                            Nhắm mắt cố xóa dòng đời này ái phong trần vỡ tan<br />
                            Đành lòng sao em xé nát tan tâm can.. họa kì thư theo bóng trăng vàng<br />
                            Giá như bây giờ, giá như em ở đây<br />
                            <br />
                            Gió ơi xin đừng lấy em đi<br />
                            Hãy mang em về … về chốn xuân thì<br />
                            Ngày nào còn bồi hồi tóc xanh<br />
                            Ngày nào còn trò chuyện với anh<br />
                            Em nói em thương anh mà<br />
                            Nói em yêu em mà<br />
                            Cớ sao ta lại hóa chia xa<br />
                            Đóa phong lan lặng lẽ mơ màng<br />
                            Nàng dịu dàng tựa đèn phố Vinh<br />
                            Đẹp rạng ngời chẳng cần cố Xinh<br />
                        </p>

                    </div>
                </aside>
            </SimpleBar>
        </>
    );
};

export default NowPlayingSidebar;