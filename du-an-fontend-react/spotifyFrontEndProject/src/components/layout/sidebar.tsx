import { App, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useCurrentApp } from "../context/app.context";
import { createPlaylistAPI, getPlaylistAPI } from "../../services/api";
import { useAlbum } from "../context/album.context";
import { useNavigate } from "react-router-dom";

type FieldType = {
    name: string;
    userid: string;
}

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("playlist");
    const { albums, setAlbums } = useAlbum();

    const { user, isAuthenticated } = useCurrentApp();
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const refreshPlaylist = async () => {
        if (!user?.id) return;
        const res = await getPlaylistAPI(user.id);
        if (res.data) {
            setAlbums(res.data);
        }
    };

    //Tạo playlist
    const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
        const { name, userid } = value;
        const res = await createPlaylistAPI(userid, name);
        if (res.data) {
            message.success("Tạo album thành công!");
            setIsModalOpen(false);
            refreshPlaylist();
        }
    }
    //Get playlist
    useEffect(() => {
        const getPlaylist = async () => {
            if (user?.id) {
                const res = await getPlaylistAPI(user?.id);
                if (res.data) {
                    setAlbums(res.data);
                }
            }
        }
        getPlaylist();
    }, [user?.id])

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                userid: user.id,
            })
        }
    }, [user])

    const handlePlaylistClick = (playlist: IPlaylist) => {
        navigate(`/playlist/${playlist.playlist_id}/${encodeURIComponent(playlist.name)}`);
    };

    return (
        <>
            <div>
                <aside className="h-full text-white flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Playlist của bạn</h2>
                        <button className="text-sm bg-white text-black rounded-full px-2 py-0.5 font-semibold"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}>
                            + Tạo playlist
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    {/* <div className="flex gap-2 mb-3">
                        <button onClick={() => setActiveTab("playlist")} className={`px-3 py-1 rounded-full text-sm ${activeTab === "playlist" ? "bg-white text-black" : "bg-zinc-800"}`}>Danh sách phát</button>
                        <button onClick={() => setActiveTab("artist")} className={`px-3 py-1 rounded-full text-sm ${activeTab === "artist" ? "bg-white text-black" : "bg-zinc-800"}`}>Nghệ sĩ</button>
                        <button onClick={() => setActiveTab("album")} className={`px-3 py-1 rounded-full text-sm ${activeTab === "album" ? "bg-white text-black" : "bg-zinc-800"}`}>Album</button>
                    </div> */}
                    {/* List items */}
                    {(isAuthenticated) ?
                        <div className="overflow-y-auto flex-1 space-y-2 mt-2 pr-2">
                            {albums?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 items-center p-2 hover:bg-zinc-800 rounded cursor-pointer"
                                    onClick={() => handlePlaylistClick(item)}
                                >
                                    <div className="w-10 h-10 bg-zinc-700 rounded shadow flex items-center justify-center">
                                        <i className="fa-solid fas fa-compact-disc" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium truncate">{item.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div><p>Tạo tài khoản ngay để tạo playlist yêu thích!</p></div>
                    }
                </aside>

                <Modal title="Tạo playlist" open={isModalOpen} onOk={() => { form.submit() }} onCancel={() => { setIsModalOpen(false) }}>
                    <Form form={form} name="form-create-playlist" onFinish={onFinish} autoComplete="off"
                    >
                        <Form.Item<FieldType> className="pt-1" label="Tên playlist" name="name" rules={[{
                            required: true, message: "Không được để trống username!"
                        }]} >
                            <Input
                                placeholder="Tên danh sách phát"
                                className="mb-4"
                            /></Form.Item>
                        <Form.Item<FieldType> labelCol={{ span: 24 }} name="userid" hidden >
                            <Input className="cus-placeholder" placeholder="name@domain.com" />
                        </Form.Item>

                    </Form>
                </Modal >
            </div>

        </>
    );
};

export default Sidebar;
