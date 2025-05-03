import React, { useState } from 'react';
import {
    AppstoreOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CustomerServiceOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space } from 'antd';
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useCurrentApp } from '../../context/app.context';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;


const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { setUser, user, isAuthenticated, setIsAuthenticated } = useCurrentApp();


    const handleLogout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
    }

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage Users</span>,
            key: 'user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: 'crud',
                    icon: <TeamOutlined />,
                },
                // {
                //     label: 'Files1',
                //     key: 'file1',
                //     icon: <TeamOutlined />,
                // }
            ]
        },
        {
            label: <Link to='/admin/track'>Manage tracks</Link>,
            key: 'track',
            icon: <CustomerServiceOutlined />
        },
        {
            label: <Link to='/admin/singer'>Manage singers</Link>,
            key: 'singer',
            icon: <StarOutlined />
        },
    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];


    if (isAuthenticated == false) {
        return (
            <Outlet />
        )
    }
    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated == true && isAdminRoute == true) {
        const role = user?.role_id;
        if (role == 0) {
            return (
                <Outlet />
            )
        }
    }
    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",

                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                Xin chào, {user?.fullname}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        Bui Thach <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};

export default LayoutAdmin;