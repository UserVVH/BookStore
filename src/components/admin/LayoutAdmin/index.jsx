import { Outlet } from "react-router-dom";
import FooterAdmin from "../Footer";
import { Content } from "antd/es/layout/layout";
import HeaderAdmin from "../Header";
import { Layout } from "antd";
import SideBar from "../Sidebar";
import Sider from "antd/es/layout/Sider";
import { useSelector } from "react-redux";

const LayoutAdmin = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const userRole = user.role;
  return (
    <>
      {isAdminRoute && userRole === "ADMIN" ? (
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider>
            <SideBar />
          </Sider>

          <Layout>
            <HeaderAdmin />
            <Content
              style={{
                padding: "20px",
                background: "#f0f5ff",
              }}
            >
              <Outlet />
            </Content>

            <FooterAdmin />
          </Layout>
        </Layout>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default LayoutAdmin;
