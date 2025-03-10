import { Drawer, Typography, Descriptions, List, Card, Tag, Space } from "antd";
import { ShoppingCartOutlined, ClockCircleOutlined } from "@ant-design/icons";
import styles from "./OrderDetails.module.css";

const { Title, Text } = Typography;

const OrderDetails = ({
  isDrawerVisible,
  setIsDrawerVisible,
  selectedOrder,
}) => {
  return (
    <Drawer
      title={
        <Space>
          <ShoppingCartOutlined className={styles.titleIcon} />
          <span>Chi tiết đơn hàng #{selectedOrder?._id}</span>
        </Space>
      }
      open={isDrawerVisible}
      onClose={() => setIsDrawerVisible(false)}
      width={600}
      className={styles.orderDrawer}
    >
      <div className={styles.drawerContent}>
        <Descriptions column={1} bordered className={styles.descriptions}>
          <Descriptions.Item label="Tên người mua">
            {selectedOrder?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {selectedOrder?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {selectedOrder?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng giá tiền">
            <Text type="success" strong>
              {selectedOrder?.totalPrice}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày mua">
            <Space>
              <ClockCircleOutlined />
              {new Date(selectedOrder?.updatedAt).toLocaleDateString("vi-VN")}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Title level={4} className={styles.itemsTitle}>
          Sản phẩm đã mua
        </Title>

        <List
          dataSource={selectedOrder?.detail}
          renderItem={(item) => (
            <Card className={styles.itemCard}>
              <Space size="large">
                <div>
                  <Text strong>{item.bookName}</Text>
                  <br />
                  <Tag color="blue">Số lượng: {item.quantity}</Tag>
                </div>
              </Space>
            </Card>
          )}
        />
      </div>
    </Drawer>
  );
};

export default OrderDetails;
