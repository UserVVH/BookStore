import { useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation } from "react-router-dom";
import {
  UserOutlined,
  PieChartOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Sider } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Updated to use semantic keys
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/admin") return "dashboard";
    if (path === "/admin/users") return "users";
    if (path === "/admin/books") return "books";
    if (path === "/admin/orders") return "orders";
    if (path === "/") return "home";
    return "dashboard"; // default fallback
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu theme="dark" selectedKeys={[getSelectedKey()]} mode="inline">
            <Menu.Item
              key="home"
              icon={<HomeOutlined />}
              style={{ fontSize: "17px" }}
            >
              <Link to="/">Return to Home</Link>
            </Menu.Item>
            <Menu.Item
              key="dashboard"
              icon={<PieChartOutlined />}
              style={{ fontSize: "17px" }}
            >
              <Link to="/admin">Dashboard</Link>
            </Menu.Item>
            <Menu.SubMenu
              key="user-management"
              icon={<UserOutlined />}
              title="Manage Users"
              style={{ fontSize: "17px" }}
            >
              <Menu.Item key="users" style={{ fontSize: "17px" }}>
                <Link to="/admin/users">User</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
              key="books"
              icon={<BookOutlined />}
              style={{ fontSize: "17px" }}
            >
              <Link to="/admin/books">Manage Books</Link>
            </Menu.Item>
            <Menu.Item
              key="orders"
              icon={<ShoppingCartOutlined />}
              style={{ fontSize: "17px" }}
            >
              <Link to="/admin/orders">Manage Orders</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </>
  );
};

export default SideBar;
