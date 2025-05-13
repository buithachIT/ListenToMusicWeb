import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { useState } from 'react';
import { updateArtistAPI } from '../../../services/api';
import { AxiosError } from 'axios';

interface UpdateSingerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    artist: {
        artist_id: number;
        name: string;
        gener?: string;
        popularity_score?: number;
        follower?: number;
        avatar?: string;
    };
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

    const onFinish = async (values: ArtistFormValues) => {
        setLoading(true);
        try {
            const { name, gener, popularity_score, follower, avatar } = values;

            await updateArtistAPI(
                artist.artist_id,
                name,
                gener,
                popularity_score,
                follower,
                avatar,
                undefined // No file upload needed
            );

            message.success('Artist updated successfully');
            onSuccess();
            onClose();
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
                    label="Avatar URL"
                    rules={[{ required: true, message: 'Please input avatar URL!' }]}
                >
                    <Input placeholder="Enter image URL" />
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
