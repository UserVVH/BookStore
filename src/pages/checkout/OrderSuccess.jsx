import { Button, Timeline, Card, Typography, Space } from "antd";
import {
  CheckCircleFilled,
  HistoryOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./OrderSuccess.module.css";

const { Title, Text } = Typography;

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { checkoutProducts, totalPrice } = useSelector((state) => state.order);

  const handleViewOrders = () => {
    navigate("/purchase-history");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.successSection}>
        <CheckCircleFilled className={styles.successIcon} />
        <Title level={2}>Đặt hàng thành công!</Title>
        <Text type="secondary">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ giao hàng trong thời gian sớm
          nhất.
        </Text>
      </div>

      <div className={styles.orderContent}>
        <div className={styles.leftColumn}>
          <Card className={styles.orderSummary}>
            <Title level={4}>
              <ShoppingOutlined /> Chi tiết đơn hàng
            </Title>
            <div className={styles.productList}>
              {checkoutProducts.map((product, index) => (
                <div key={index} className={styles.productItem}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.productInfo}>
                    <Text strong>{product.name}</Text>
                    <Space>
                      <Text type="secondary">Số lượng:</Text>
                      <Text>{product.quantityValue}</Text>
                    </Space>
                    <Text className={styles.priceValue}>
                      ₫{product.price.toLocaleString("vi-VN")}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.totalPrice}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text>Tạm tính:</Text>
                  <Text>₫{totalPrice.toLocaleString("vi-VN")}</Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text>Phí vận chuyển:</Text>
                  <Text>₫23.688</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <Text strong>Tổng cộng:</Text>
                  <Text className={styles.priceValue}>
                    ₫{(totalPrice + 23688).toLocaleString("vi-VN")}
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </div>

        <div className={styles.rightColumn}>
          <Card className={styles.deliveryTimeline}>
            <Title level={4}>
              <HistoryOutlined /> Trạng thái đơn hàng
            </Title>
            <Timeline
              items={[
                {
                  color: "green",
                  children: (
                    <div>
                      <Text strong>Đơn hàng đã được đặt thành công</Text>
                      <br />
                      <Text type="secondary">
                        {new Date().toLocaleString("vi-VN")}
                      </Text>
                    </div>
                  ),
                },
                {
                  color: "blue",
                  children: "Đang chờ xác nhận",
                },
                {
                  color: "gray",
                  children: "Đang chuẩn bị hàng",
                },
                {
                  color: "gray",
                  children: "Đang giao hàng",
                },
              ]}
            />
          </Card>

          <Space direction="vertical" className={styles.actions} size="middle">
            <Button
              type="primary"
              icon={<HistoryOutlined />}
              block
              onClick={handleViewOrders}
            >
              Xem đơn hàng của tôi
            </Button>
            <Button icon={<HomeOutlined />} block onClick={handleBackHome}>
              Về trang chủ
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
