
import { BarChartOutlined, BookOutlined, CalculatorOutlined, LogoutOutlined, UserOutlined, VideoCameraOutlined, WalletOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const items = [
    {
        key: '0',
        path: '/',
        label: `Thống kê`,
        icon: <BarChartOutlined />
    },
    {
        key: '1',
        path: '/loans',
        label: `Cầm đồ`,
        icon: <CalculatorOutlined />

    },
    {
        key: '2',
        path: '/history',
        label: `Lịch sử giao dịch`,
        icon: <BookOutlined />
    },
    {
        key: '3',
        path: '/wallets',
        label: `Thu chi`,
        icon: <WalletOutlined />
    }, {
        type: 'divider',
    },
    {
        key: '4',
        path: '/logout',
        label: `Đăng xuất`,
        icon: <LogoutOutlined />
    },
]
const RootLayout = () => {
    const navigate = useNavigate()
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="80"
                theme='light'
                style={{ padding: '20px 0px', borderRight: `1px solid #f1f1f1` }}
            >
                <center>
                    <h1>Cầm đồ F99</h1>
                </center>
                <Menu
                    theme="light"
                    mode="inline"
                    items={items.map((r, index) => r.type === 'divider' ? r : ({ key: r.path, label: r.label, icon: r.icon }),
                    )}
                    onClick={({ key }) => key === '/logout' ? alert('Logout') : navigate(key)}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content style={{ margin: '24px 16px 0', }} >
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center', }} >
                    ©2023 Created by Nhat Huynh
                </Footer>
            </Layout>
        </Layout >
    );
};
export default RootLayout;