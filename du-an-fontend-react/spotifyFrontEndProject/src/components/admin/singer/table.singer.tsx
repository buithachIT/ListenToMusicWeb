import { EditTwoTone, DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Table, Popconfirm, Button, Space, Image, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { getTopArtistAPI, deleteArtistAPI } from '../../../services/api';
import AddSinger from './add.singer';
import UpdateSinger from './update.singer';
import { AxiosError } from 'axios';

const TableSinger = () => {
    const [artists, setArtists] = useState<IArtist[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<IArtist | null>(null);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const res = await getTopArtistAPI();
            if (res?.data) {
                setArtists(res.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data?.length || 0,
                }));
            }
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
        setLoading(false);
    };

    const handleEdit = (record: IArtist) => {
        setSelectedArtist(record);
        setIsUpdateModalOpen(true);
    };

    const handleDelete = async (artist_id: number) => {
        try {
            await deleteArtistAPI(artist_id);
            message.success('Artist deleted successfully');
            fetchArtists();
        } catch (error) {
            if (error instanceof AxiosError) {
                message.error(error.response?.data?.message || 'Failed to delete artist');
            } else {
                message.error('Failed to delete artist');
            }
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        setPagination(prev => ({
            ...prev,
            current: newPagination.current || 1,
            pageSize: newPagination.pageSize || 5,
        }));
        fetchArtists();
    };

    const columns: ColumnsType<IArtist> = [
        {
            title: 'ID',
            dataIndex: 'artist_id',
            key: 'artist_id',
            render: (id) => <a href="#">{id}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Genre',
            dataIndex: 'gener',
            key: 'gener',
            render: (gener) => gener || 'N/A',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar) => (
                <Image
                    src={avatar}
                    alt="Artist avatar"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Popularity Score',
            dataIndex: 'popularity_score',
            key: 'popularity_score',
            render: (score) => score || 0,
        },
        {
            title: 'Followers',
            dataIndex: 'follower',
            key: 'follower',
            render: (follower) => follower || 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditTwoTone twoToneColor="#f57800" />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete Artist"
                        description="Are you sure you want to delete this artist?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record.artist_id)}
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
                    Add Artist
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={artists}
                rowKey="artist_id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                locale={{
                    emptyText: 'No Data',
                }}
            />
            <AddSinger
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchArtists}
            />
            {selectedArtist && (
                <UpdateSinger
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedArtist(null);
                    }}
                    onSuccess={fetchArtists}
                    artist={selectedArtist}
                />
            )}
        </div>
    );
};

export default TableSinger;
