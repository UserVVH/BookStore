import React, { useEffect, useState } from "react";
import { List, Tag, Typography, Button, Modal, Space, Row, Col } from "antd";
import { EyeOutlined, ClockCircleOutlined } from "@ant-design/icons";
import styles from "./OrderHistory.module.css";
import { getOrderHistory } from "../../service/order-service";

const { Text, Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    handleGetOrderHistory();
  }, []);

  const handleGetOrderHistory = async () => {
    try {
      const response = await getOrderHistory();
      const orderData = Array.isArray(response)
        ? response
        : response.data || [];
      const ordersWithStatus = orderData.map((order) => ({
        ...order,
        status: "Đã giao",
      }));
      setOrders(ordersWithStatus);
    } catch (error) {
      console.error("Failed to fetch order history:", error);
      setOrders([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "success";
      case "Đang giao":
        return "processing";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Define common column widths
  const columnWidths = {
    stt: { xs: 0, sm: 2 },
    orderId: { xs: 0, sm: 4 },
    time: { xs: 0, sm: 5 },
    amount: { xs: 0, sm: 5 },
    status: { xs: 0, sm: 4 },
    actions: { xs: 0, sm: 4 },
  };

  // Mobile layout columns
  const mobileColumnWidths = {
    number: { xs: 4, sm: 0 },
    timeInfo: { xs: 20, sm: 0 },
    amount: { xs: 12, sm: 0 },
    status: { xs: 12, sm: 0 },
    actions: { xs: 24, sm: 0 },
  };

  return (
    <div className={styles.container}>
      <Title level={4} className={styles.pageTitle}>
        Lịch sử đơn hàng
      </Title>

      <div className={styles.tableContainer}>
        {/* Table Header - Only visible on tablet and up */}
        <Row className={styles.tableHeader} align="middle">
          <Col {...columnWidths.stt}>
            <Text strong>STT</Text>
          </Col>
          <Col {...columnWidths.orderId}>
            <Text strong>Mã đơn hàng</Text>
          </Col>
          <Col {...columnWidths.time}>
            <Text strong>Thời gian</Text>
          </Col>
          <Col {...columnWidths.amount}>
            <Text strong>Tổng số tiền</Text>
          </Col>
          <Col {...columnWidths.status}>
            <Text strong>Trạng thái</Text>
          </Col>
          <Col {...columnWidths.actions}>
            <Text strong>Chi tiết</Text>
          </Col>
        </Row>

        <List
          className={styles.orderList}
          dataSource={orders}
          renderItem={(order, index) => (
            <List.Item className={styles.orderItem}>
              {/* Desktop/Tablet Layout */}
              <Row
                className={`${styles.orderContent} ${styles.desktopLayout}`}
                align="middle"
              >
                <Col {...columnWidths.stt}>
                  <Text className={styles.orderNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </Col>

                <Col {...columnWidths.orderId}>
                  <Text className={styles.orderId} ellipsis>
                    {order._id.slice(-8).toUpperCase()}
                  </Text>
                </Col>

                <Col {...columnWidths.time}>
                  <Space
                    direction="vertical"
                    size={0}
                    className={styles.timeInfo}
                  >
                    <Text className={styles.date}>
                      {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
                    </Text>
                    <Text type="secondary" className={styles.time}>
                      {new Date(order.updatedAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Space>
                </Col>

                <Col {...columnWidths.amount}>
                  <Text strong className={styles.totalAmount}>
                    {formatPrice(order.totalPrice)}
                  </Text>
                </Col>

                <Col {...columnWidths.status}>
                  <Tag
                    color={getStatusColor(order.status)}
                    className={styles.statusTag}
                  >
                    {order.status}
                  </Tag>
                </Col>

                <Col {...columnWidths.actions}>
                  <div className={styles.actionsColumn}>
                    <Button
                      type="primary"
                      ghost
                      icon={<EyeOutlined />}
                      onClick={() => showOrderDetails(order)}
                      className={styles.detailsButton}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Mobile Layout */}
              <Row
                className={`${styles.orderContent} ${styles.mobileLayout}`}
                align="middle"
              >
                <Col {...mobileColumnWidths.number}>
                  <Text className={styles.orderNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </Col>

                <Col {...mobileColumnWidths.timeInfo}>
                  <Space
                    direction="vertical"
                    size={0}
                    className={styles.timeInfo}
                  >
                    <Text className={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </Text>
                    <Text type="secondary" className={styles.time}>
                      {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Space>
                </Col>

                <Col xs={24} sm={0} className={styles.mobileAmountStatus}>
                  <div className={styles.amountWrapper}>
                    <Text strong className={styles.totalAmount}>
                      {formatPrice(order.totalPrice)}
                    </Text>
                  </div>
                  <div className={styles.statusWrapper}>
                    <Tag
                      color={getStatusColor(order.status)}
                      className={styles.statusTag}
                    >
                      {order.status}
                    </Tag>
                  </div>
                </Col>

                <Col {...mobileColumnWidths.actions}>
                  <Button
                    type="primary"
                    ghost
                    icon={<EyeOutlined />}
                    onClick={() => showOrderDetails(order)}
                    className={styles.detailsButton}
                  >
                    Chi tiết
                  </Button>
                </Col>

                {/* Mobile Summary */}
                <Col xs={24} sm={0}>
                  <div className={styles.mobileSummary}>
                    <Text type="secondary">{order.detail.length} sản phẩm</Text>
                    <Text type="secondary" ellipsis>
                      {order.detail[0].bookName}
                      {order.detail.length > 1 &&
                        ` +${order.detail.length - 1} khác`}
                    </Text>
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={
          <div className={styles.modalTitle}>
            <Text strong>Chi tiết đơn hàng</Text>
            <Tag
              style={{
                marginLeft: 5,
              }}
              color={selectedOrder && getStatusColor(selectedOrder.status)}
            >
              {selectedOrder?.status}
            </Tag>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        className={styles.detailsModal}
      >
        {selectedOrder && (
          <div className={styles.modalContent}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Space
                  direction="vertical"
                  size={16}
                  className={styles.orderInfo}
                >
                  <div className={styles.modalSection}>
                    <Text type="secondary">Mã đơn hàng:</Text>
                    <Text strong>{selectedOrder._id}</Text>
                  </div>
                  <div className={styles.modalSection}>
                    <Text type="secondary">Ngày đặt hàng:</Text>
                    <Text strong>{formatDate(selectedOrder.updatedAt)}</Text>
                  </div>
                </Space>
              </Col>

              <Col span={24}>
                <Title level={5} className={styles.productListTitle}>
                  Chi tiết sản phẩm
                </Title>
                <List
                  dataSource={selectedOrder.detail}
                  renderItem={(item) => (
                    <List.Item className={styles.productItem}>
                      <Space
                        direction="vertical"
                        size={8}
                        className={styles.productInfo}
                      >
                        <Text strong>{item.bookName}</Text>
                        <Text type="secondary">Số lượng: {item.quantity}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Col>

              <Col span={24} className={styles.modalFooter}>
                <div className={styles.totalSection}>
                  <Text strong>Tổng tiền:</Text>
                  <Text strong className={styles.totalAmount}>
                    {formatPrice(selectedOrder.totalPrice)}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
