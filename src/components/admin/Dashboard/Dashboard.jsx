import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import styles from "./Dashboard.module.css";
import { getDashboardData } from "../../../service/dashboard-service";

const formatter = (value) => (
  <CountUp end={value} separator="," duration={2.5} />
);

const DashboardAdmin = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  const handleGetDashboardData = async () => {
    const res = await getDashboardData();
    if (res.data) {
      setTotalUsers(res.data.countUser);
      setTotalOrders(res.data.countOrder);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.backgroundPattern} />
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <Card hoverable className={`${styles.statsCard} ${styles.usersCard}`}>
            <div className={styles.cardContent}>
              <Statistic
                title={<span className={styles.cardTitle}>TOTAL USERS</span>}
                value={totalUsers}
                formatter={formatter}
                prefix={<UserOutlined className={styles.cardIcon} />}
                className={styles.statistic}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            className={`${styles.statsCard} ${styles.ordersCard}`}
          >
            <div className={styles.cardContent}>
              <Statistic
                title={<span className={styles.cardTitle}>TOTAL ORDERS</span>}
                value={totalOrders}
                formatter={formatter}
                prefix={<ShoppingCartOutlined className={styles.cardIcon} />}
                className={styles.statistic}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
