import { EditTwoTone, DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Table, Popconfirm, Button, Space, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { getAllUsersAPI, deleteUserAPI } from '../../../services/api';
import CreateUser from './create.user';
import UpdateUser from './update.user';
import { AxiosError } from 'axios';

const TableUser = () => {
    const [users, setUsers] = useState<IUserList[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IUserList | null>(null);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsersAPI();
            if (res?.data) {
                setUsers(res.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data?.length || 0,
                }));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUserAPI(id);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            if (error instanceof AxiosError) {
                message.error(error.response?.data?.message || 'Failed to delete user');
            } else {
                message.error('Failed to delete user');
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        setPagination(prev => ({
            ...prev,
            current: newPagination.current || 1,
            pageSize: newPagination.pageSize || 5,
        }));
        fetchUsers();
    };

    const columns: ColumnsType<IUserList> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <a href="#">{id}</a>,
        },
        {
            title: 'Username',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditTwoTone twoToneColor="#f57800" />}
                        onClick={() => {
                            setDataUpdate(record);
                            setOpenModalUpdate(true);
                        }}
                    />
                    <Popconfirm
                        title="Delete User"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
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
                    onClick={() => setOpenModalCreate(true)}
                >
                    Add User
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                locale={{
                    emptyText: 'No Data',
                }}
            />
            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={fetchUsers}
            />
            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                refreshTable={fetchUsers}
            />
        </div>
    );
};

export default TableUser;
