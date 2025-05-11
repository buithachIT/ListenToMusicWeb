import { Modal, Form, Input, InputNumber, Button, message, Upload, Select, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import { getTopArtistAPI, updateTrackAPI } from '../../../services/api';
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    track: ITrack;
}

interface FieldType {
    title: string;
    artist_id: number;
    album_id: number | null;
    price: number;
    namemp3: string;
    is_copyright: number;
    listen: number;
    mv_url: string;
    image_url: string;
    release_date: string;
    file?: UploadFile[];
    mv_file?: UploadFile[];
}

const UpdateTrack = ({ isOpen, onClose, onSuccess, track }: IProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [mvFileList, setMvFileList] = useState<UploadFile[]>([]);
    const [artists, setArtists] = useState<IArtist[]>([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await getTopArtistAPI();
                if (res?.data) {
                    setArtists(res.data);
                }
            } catch (error) {
                console.error('Error fetching artists:', error);
                message.error('Failed to load artists');
            }
        };
        fetchArtists();
    }, []);

    useEffect(() => {
        if (track) {
            form.setFieldsValue({
                title: track.title,
                artist_id: track.artist?.artist_id,
                price: track.price,
                namemp3: track.namemp3,
                is_copyright: track.is_copyright,
                listen: track.listen,
                mv_url: track.mv_url,
                image_url: track.image_url,
                release_date: track.release_date ? dayjs(track.release_date) : undefined
            });
        }
    }, [track, form]);

    const beforeUpload = (file: RcFile, type: 'mp3' | 'video') => {
        if (type === 'mp3') {
            const isMP3 = file.type === 'audio/mpeg';
            if (!isMP3) {
                message.error('You can only upload MP3 files!');
                return false;
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error('File must be smaller than 10MB!');
                return false;
            }
            return isMP3 && isLt10M;
        } else {
            const isVideo = file.type.startsWith('video/');
            if (!isVideo) {
                message.error('You can only upload video files!');
                return false;
            }
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('File must be smaller than 50MB!');
                return false;
            }
            return isVideo && isLt50M;
        }
    };

    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }, type: 'mp3' | 'video') => {
        if (type === 'mp3') {
            setFileList(newFileList);
            if (newFileList.length > 0) {
                const fileName = newFileList[0].name;
                form.setFieldValue('namemp3', fileName);
            }
        } else {
            setMvFileList(newFileList);
            if (newFileList.length > 0) {
                const fileName = newFileList[0].name;
                form.setFieldValue('mv_url', fileName);
            }
        }
    };

    const onFinish = async (values: FieldType) => {
        setLoading(true);
        try {
            const mp3File = fileList.length > 0 ? fileList[0].originFileObj : undefined;
            const mvFile = mvFileList.length > 0 ? mvFileList[0].originFileObj : undefined;
            const formattedDate = values.release_date ? dayjs(values.release_date).format('YYYY-MM-DD') : undefined;

            await updateTrackAPI(
                track.track_id,
                values.title,
                values.artist_id,
                values.album_id,
                values.namemp3,
                values.price,
                values.image_url,
                formattedDate,
                values.is_copyright,
                mp3File,
                values.listen,
                mvFile
            );

            message.success('Track updated successfully');
            form.resetFields();
            setFileList([]);
            setMvFileList([]);
            onSuccess();
            onClose();
        } catch (error) {
            if (error instanceof AxiosError) {
                message.error(error.response?.data?.message || 'Failed to update track');
            } else {
                message.error('Failed to update track');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Update Track"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                name="update_track"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input the track title!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Artist"
                    name="artist_id"
                    rules={[{ required: true, message: 'Please select an artist!' }]}
                >
                    <Select
                        placeholder="Select an artist"
                        options={artists.map(artist => ({
                            value: artist.artist_id,
                            label: artist.name
                        }))}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input the price!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        precision={2}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Release Date"
                    name="release_date"
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="MP3 File"
                    name="namemp3"
                    rules={[{ required: true, message: 'Please upload an MP3 file!' }]}
                >
                    <Upload
                        beforeUpload={(file) => beforeUpload(file, 'mp3')}
                        fileList={fileList}
                        onChange={(info) => handleFileChange(info, 'mp3')}
                        maxCount={1}
                        accept=".mp3"
                    >
                        <Button icon={<UploadOutlined />}>Upload MP3</Button>
                    </Upload>
                </Form.Item>

                <Form.Item<FieldType>
                    label="MV File"
                    name="mv_url"
                >
                    <Upload
                        beforeUpload={(file) => beforeUpload(file, 'video')}
                        fileList={mvFileList}
                        onChange={(info) => handleFileChange(info, 'video')}
                        maxCount={1}
                        accept="video/*"
                    >
                        <Button icon={<VideoCameraOutlined />}>Upload MV</Button>
                    </Upload>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Cover Image URL"
                    name="image_url"
                >
                    <Input placeholder="Enter image URL" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Copyright Status"
                    name="is_copyright"
                    rules={[{ required: true, message: 'Please select copyright status!' }]}
                >
                    <Select
                        options={[
                            { value: 1, label: 'Copyrighted' },
                            { value: 0, label: 'Not Copyrighted' }
                        ]}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Listen Count"
                    name="listen"
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Track
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateTrack; 