import { Modal, Form, Input, InputNumber, Button, message, Upload, Select } from 'antd';
import { useState, useEffect } from 'react';
import { getTopArtistAPI, createTrackAPI } from '../../../services/api';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import { AxiosError } from 'axios';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FieldType {
    title: string;
    artist_id: number;
    album_id: number;
    price: number;
    namemp3: string;
    is_copyright: number;
    listen: number;
    mv_url: string;
}

const AddTrack = ({ isOpen, onClose, onSuccess }: IProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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

    const beforeUpload = (file: RcFile) => {
        const isMP3 = file.type === 'audio/mpeg';
        if (!isMP3) {
            message.error('You can only upload MP3 files!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('File must be smaller than 10MB!');
        }
        return isMP3 && isLt10M;
    };

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            const fileName = newFileList[0].name;
            form.setFieldValue('namemp3', fileName);
        }
    };

    const onFinish = async (values: FieldType) => {
        setLoading(true);
        try {
            const file = fileList.length > 0 ? fileList[0].originFileObj : undefined;

            await createTrackAPI(
                values.title,
                values.artist_id,
                values.album_id || null,
                values.namemp3,
                values.price,
                undefined, // image_url
                undefined, // release_date
                values.is_copyright,
                file,
                values.listen || 0
            );

            message.success('Track added successfully');
            form.resetFields();
            setFileList([]);
            onSuccess();
            onClose();
        } catch (error) {
            if (error instanceof AxiosError) {
                message.error(error.response?.data?.message || 'Failed to add track');
            } else {
                message.error('Failed to add track');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add New Track"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                name="add_track"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{
                    is_copyright: 1,
                    listen: 0
                }}
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
                    label="Album ID"
                    name="album_id"
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Price"
                    name="price"
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="MP3 File"
                    name="namemp3"
                    rules={[{ required: true, message: 'Please upload an MP3 file!' }]}
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        fileList={fileList}
                        onChange={handleChange}
                        maxCount={1}
                        accept=".mp3"
                    >
                        <Button icon={<UploadOutlined />}>Upload MP3</Button>
                    </Upload>
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

                <Form.Item<FieldType>
                    label="MV URL"
                    name="mv_url"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Add Track
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTrack;
