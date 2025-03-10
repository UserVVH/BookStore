import { useState } from "react";
import {
  Input,
  Button,
  Badge,
  Drawer,
  Menu,
  Space,
  Dropdown,
  message,
  Avatar,
  Typography,
  Spin,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  MenuOutlined,
  SettingOutlined,
  LogoutOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount } from "../../service/auth-service";
import { doLogoutAccountAction } from "../../redux/account/accountSlice";
import { setSearchTerm } from "../../redux/search/searchSlice";
import convertToSlug from "../../utils/string-utils";
import AccountManagement from "../AccountManagement/AccountManagement";

const { Text } = Typography;

const Header = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  const user = useSelector((state) => state.account.user);
  const userName = user.fullName;
  const isAdmin = user.role === "ADMIN";
  const userAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user.avatar
  }`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const cartQuantity = useSelector((state) => state.order.cart?.length ?? 0);

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

  const handleAccountManagementClick = (e) => {
    e.preventDefault();
    setIsAccountModalVisible(true);
  };

  const menu = (
    <Menu>
      {isAdmin && (
        <Menu.Item
          key="0"
          icon={<CrownOutlined />}
          style={{ fontSize: "17px" }}
        >
          <Link to="/admin">Quản trị admin</Link>
        </Menu.Item>
      )}
      <Menu.Item
        key="1"
        icon={<SettingOutlined />}
        style={{ fontSize: "17px" }}
      >
        <span onClick={handleAccountManagementClick}>Quản lý tài khoản</span>
      </Menu.Item>

      <Menu.Item
        key="2"
        icon={<ShoppingCartOutlined />}
        style={{ fontSize: "17px" }}
      >
        <Link to="/purchase-history">Lịch sử mua hàng</Link>
      </Menu.Item>

      <Menu.Item key="3" icon={<LogoutOutlined />} style={{ fontSize: "17px" }}>
        <span onClick={handleLogout}>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  const handleSearch = (value) => {
    dispatch(setSearchTerm(value));
    if (value) {
      navigate(
        {
          pathname: "/",
          search: `?search=${encodeURIComponent(value)}`,
        },
        { replace: true }
      );
    } else {
      navigate("/", { replace: true });
    }
  };

  const CartPreview = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const cartItems = useSelector((state) => state.order.cart);
    const navigate = useNavigate();

    const handleBookClick = (book) => {
      const slug = convertToSlug(book.mainText);
      navigate(`/book/${slug}?id=${book._id}`);
    };

    return (
      <div className={styles.cartPreview}>
        <div className={styles.cartPreviewHeader}>
          <Text strong>Sản Phẩm Mới Thêm</Text>
        </div>
        <div className={styles.cartPreviewItems}>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className={styles.cartItem}
              onClick={() => handleBookClick(item.detail)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.productImageWrapper}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    item.detail.thumbnail
                  }`}
                  alt={item.detail.mainText}
                  className={`${styles.productImage} ${
                    !imageLoaded ? styles.productImageLoading : ""
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = "/fallback-image.png";
                  }}
                  loading="lazy"
                  width={50}
                  height={50}
                />
                {!imageLoaded && (
                  <div className={styles.imagePlaceholder}>
                    <Spin size="small" />
                  </div>
                )}
              </div>
              <div className={styles.productInfo}>
                <Text className={styles.productName}>
                  {item.detail.mainText}
                </Text>
                <Text className={styles.productPrice}>
                  ₫{item.detail.price.toLocaleString()}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cartPreviewFooter}>
          <Text>{cartItems.length} Thêm Hàng Vào Giỏ</Text>
          <Button
            type="primary"
            className={styles.viewCartButton}
            onClick={() => navigate("/order")}
          >
            Xem Giỏ Hàng
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Sidebar Menu Button for Mobile */}
          <Button
            className={styles.menuButton}
            icon={<MenuOutlined />}
            onClick={showDrawer}
            size="large"
          />

          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/" data-view-id="header_main_logo">
              BookAAA
            </Link>
          </div>

          {/* Search Container */}
          <Input.Search
            value={searchTerm}
            className={styles.searchContainer}
            placeholder="Tìm kiếm sản phẩm"
            enterButton="Tìm kiếm"
            prefix={<SearchOutlined />}
            size="large"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />

          {/* User Menu (Visible only on larger screens) */}
          <div className={styles.menuItems}>
            <Link to="/" className={styles.menuItem}>
              <Button type="link" icon={<HomeOutlined />}>
                Trang chủ
              </Button>
            </Link>
            <Dropdown
              overlay={<CartPreview />}
              trigger={["hover"]}
              placement="bottomRight"
              arrow
            >
              <Link to="/order" className={styles.menuItem}>
                <Badge count={cartQuantity} offset={[10, 0]}>
                  <Button
                    type="link"
                    icon={
                      <ShoppingCartOutlined
                        style={{
                          fontSize: 19,
                        }}
                      />
                    }
                  />
                </Badge>
              </Link>
            </Dropdown>
            {userName ? (
              <Space>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar
                      src={userAvatar || null} // Sử dụng ảnh nếu có, icon nếu không
                      icon={!userAvatar && <UserOutlined />}
                      size={50}
                      className={styles.customAvatar}
                    />
                    {userName && (
                      <span style={{ marginLeft: 8 }}>{userName}</span>
                    )}
                  </div>
                </Dropdown>
              </Space>
            ) : (
              <Link to="/login" className={styles.menuItem}>
                <Button type="link" icon={<UserOutlined />}>
                  Tài khoản
                </Button>
              </Link>
            )}
          </div>

          {/* Sidebar Drawer */}
          <Drawer
            title="Menu"
            placement="left"
            onClose={closeDrawer}
            visible={drawerVisible}
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className={styles.drawerItem}>
              <Input.Search
                placeholder="Tìm kiếm sản phẩm"
                enterButton="Tìm kiếm"
                prefix={<SearchOutlined />}
                size="large"
                allowClear
                onSearch={handleSearch}
              />
            </div>
            <Link to="/" className={styles.drawerItem} onClick={closeDrawer}>
              <Button
                type="link"
                icon={<HomeOutlined />}
                block
                style={{ fontSize: 20 }}
              >
                Trang chủ
              </Button>
            </Link>

            {userName ? (
              <Space
                direction="vertical"
                align="center"
                style={{
                  borderBottom: "1px solid #ddd",
                  marginBottom: "50px",
                }}
              >
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  overlayStyle={{ top: 130 }} // Điều chỉnh vị trí để menu không che mất giỏ hàng
                >
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    style={{
                      fontSize: 20,
                      color: "#1677ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Welcome {userName}
                  </Button>
                </Dropdown>
              </Space>
            ) : (
              <Link
                to="/login"
                className={styles.drawerItem}
                onClick={closeDrawer}
              >
                <Button
                  type="link"
                  icon={<UserOutlined />}
                  block
                  style={{ fontSize: 20 }}
                >
                  Tài khoản
                </Button>
              </Link>
            )}

            <Link
              to="/order"
              className={styles.drawerItem}
              onClick={closeDrawer}
            >
              <Badge count={cartQuantity} offset={[10, 0]}>
                <Button
                  type="link"
                  icon={<ShoppingCartOutlined />}
                  block
                  style={{ fontSize: 20 }}
                >
                  Giỏ hàng
                </Button>
              </Badge>
            </Link>
          </Drawer>
        </div>
      </header>

      <AccountManagement
        isAccountModalVisible={isAccountModalVisible}
        setIsAccountModalVisible={setIsAccountModalVisible}
      />
    </>
  );
};

export default Header;
