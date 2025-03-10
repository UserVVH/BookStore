import { Avatar, Dropdown, Menu, message } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount } from "../../../service/auth-service";
import { Navigate, useNavigate } from "react-router-dom";
import { doLogoutAccountAction } from "../../../redux/account/accountSlice";

const HeaderAdmin = () => {
  const user = useSelector((state) => state.account.user);
  const userName = user.fullName;
  const userAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user.avatar
  }`;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await logoutAccount();
    if (res.data) {
      message.success({
        content: "Đăng xuất thành công",
        style: {
          zIndex: 9999,
        },
      });
      dispatch(doLogoutAccountAction());
      navigate("/");
    }
  };
  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined style={{ fontSize: "17px" }} />}
        className={styles.largeMenuItem}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined style={{ fontSize: "17px" }} />}
        className={styles.largeMenuItem}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined style={{ fontSize: "17px" }} />}
        className={styles.largeMenuItem}
        onClick={handleLogout}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Admin Dashboard</div>
        <div className={styles.userSection}>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Avatar
              src={userAvatar || null} // Nếu không có ảnh thì sử dụng icon mặc định
              icon={!userAvatar && <UserOutlined />}
              size={64}
              style={{ cursor: "pointer", marginLeft: 8 }}
              className={styles.customAvatar}
            />
          </Dropdown>
          {userName && <span className={styles.welcomeText}>{userName}</span>}
        </div>
      </div>
    </>
  );
};

export default HeaderAdmin;
