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

    const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
        const { name, userid } = value;
        const res = await createPlaylistAPI(userid, name);
        if (res.data) {
            message.success("Tạo playlist thành công!");
            setIsModalOpen(false);
            refreshPlaylist();
        }
    }

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
        <div className="h-full bg-black/40 backdrop-blur-sm">
            <aside className="h-full text-white flex flex-col p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Playlist của bạn
                    </h2>
                    {isAuthenticated && (
                        <button
                            className="text-sm bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-1.5 font-medium transition-all duration-200 flex items-center gap-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <i className="fa fa-plus text-xs"></i>
                            Tạo mới
                        </button>
                    )}
                </div>

                {/* List items */}
                {isAuthenticated ? (
                    <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
                        {albums?.length > 0 ? (
                            albums.map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex gap-3 items-center p-2.5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200"
                                    onClick={() => handlePlaylistClick(item)}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                        <i className="fa-solid fa-music text-white/90" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate group-hover:text-green-400 transition-colors duration-200">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Playlist
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <i className="fa fa-music text-4xl mb-3"></i>
                                <p>Bạn chưa có playlist nào</p>
                                <p className="text-sm mt-1">Tạo playlist đầu tiên của bạn!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                            <i className="fa fa-user-plus text-2xl text-white"></i>
                        </div>
                        <p className="text-gray-300 mb-2">Tạo tài khoản ngay để tạo playlist yêu thích!</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors duration-200"
                        >
                            Đăng nhập
                        </button>
                    </div>
                )}
            </aside>

            <Modal
                title={
                    <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Tạo playlist mới
                    </div>
                }
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Tạo"
                cancelText="Hủy"
                okButtonProps={{
                    className: "bg-green-500 hover:bg-green-600"
                }}
            >
                <Form
                    form={form}
                    name="form-create-playlist"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item<FieldType>
                        label="Tên playlist"
                        name="name"
                        rules={[{
                            required: true,
                            message: "Vui lòng nhập tên playlist!"
                        }]}
                    >
                        <Input
                            placeholder="Nhập tên playlist của bạn"
                            className="rounded-lg"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="userid"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Sidebar;
