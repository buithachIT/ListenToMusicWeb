import { Modal, Form, Input, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { useState, useEffect } from 'react';
import { updateArtistAPI } from '../../../services/api';
import { AxiosError } from 'axios';

interface UpdateSingerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    artist: IArtist;
}

interface ArtistFormValues {
    name: string;
    gener?: string;
    popularity_score?: number;
    follower?: number;
    avatar?: string;
}

const UpdateSinger = ({ isOpen, onClose, onSuccess, artist }: UpdateSingerProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (isOpen && artist) {
            form.setFieldsValue({
                name: artist.name,
                gener: artist.gener,
                popularity_score: artist.popularity_score,
                follower: artist.follower,
                avatar: artist.avatar
            });
            if (artist.avatar) {
                setFileList([{
                    uid: '-1',
                    name: artist.avatar,
                    status: 'done',
                    url: artist.avatar,
                }]);
            }
        }
    }, [isOpen, artist, form]);

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
        }
        return isImage && isLt2M;
    };

    const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
        if (fileList.length > 0 && fileList[0].originFileObj) {
            form.setFieldValue('avatar', fileList[0].originFileObj.name);
        }
    };

    const onFinish = async (values: ArtistFormValues) => {
        setLoading(true);
        try {
            const { name, gener, popularity_score, follower, avatar } = values;
            const file = fileList[0]?.originFileObj;

            await updateArtistAPI(
                artist.artist_id,
                name,
                gener,
                popularity_score,
                follower,
                avatar,
                file
            );

            message.success('Artist updated successfully');
            onSuccess();
            onClose();
            form.resetFields();
            setFileList([]);
        } catch (error) {
            if (error instanceof AxiosError) {
                message.error(error.response?.data?.message || 'Failed to update artist');
            } else {
                message.error('Failed to update artist');
            }
        }
        setLoading(false);
    };

    return (
        <Modal
            title="Update Artist"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: artist.name,
                    gener: artist.gener,
                    popularity_score: artist.popularity_score,
                    follower: artist.follower,
                    avatar: artist.avatar
                }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="gener"
                    label="Genre"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="popularity_score"
                    label="Popularity Score"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="follower"
                    label="Followers"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="avatar"
                    label="Avatar"
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        fileList={fileList}
                        onChange={handleChange}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateSinger;
