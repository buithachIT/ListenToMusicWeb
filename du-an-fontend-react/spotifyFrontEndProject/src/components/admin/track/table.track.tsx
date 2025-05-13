import { EditTwoTone, DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Table, Popconfirm, Button, Space, message, Image } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { getAllTracksAPI, deleteTrackAPI } from '../../../services/api';
import { AxiosError } from 'axios';
import AddTrack from './add.track';
import UpdateTrack from './update.track';

const TableTrack = () => {
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<ITrack | null>(null);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const fetchTracks = async () => {
        setLoading(true);
        try {
            const res = await getAllTracksAPI();
            if (res?.data) {
                setTracks(res.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data?.length || 0,
                }));
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTrackAPI(id);
            message.success('Track deleted successfully');
            fetchTracks();
        } catch (error) {
            if (error instanceof AxiosError) {
                message.error(error.response?.data?.message || 'Failed to delete track');
            } else {
                message.error('Failed to delete track');
            }
        }
    };

    const handleUpdate = (track: ITrack) => {
        setSelectedTrack(track);
        setIsUpdateModalOpen(true);
    };

    useEffect(() => {
        fetchTracks();
    }, []);

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        setPagination(prev => ({
            ...prev,
            current: newPagination.current || 1,
            pageSize: newPagination.pageSize || 5,
        }));
        fetchTracks();
    };

    const columns: ColumnsType<ITrack> = [
        {
            title: 'ID',
            dataIndex: 'track_id',
            key: 'track_id',
            render: (id) => <a href="#">{id}</a>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Artist',
            dataIndex: 'artist',
            key: 'artist',
            render: (artist) => artist?.name || 'N/A',
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (image_url) => (
                <Image
                    src={image_url}
                    alt="Track cover"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price || '0.00'}`,
        },
        {
            title: 'Listens',
            dataIndex: 'listen',
            key: 'listen',
            render: (listen) => listen || 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditTwoTone twoToneColor="#f57800" />}
                        onClick={() => handleUpdate(record)}
                    />
                    <Popconfirm
                        title="Delete Track"
                        description="Are you sure you want to delete this track?"
                        onConfirm={() => handleDelete(record.track_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Track
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={tracks}
                rowKey="track_id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                locale={{
                    emptyText: 'No Data',
                }}
            />
            <AddTrack
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchTracks}
            />
            {selectedTrack && (
                <UpdateTrack
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedTrack(null);
                    }}
                    onSuccess={fetchTracks}
                    track={selectedTrack}
                />
            )}
        </div>
    );
};

export default TableTrack;

