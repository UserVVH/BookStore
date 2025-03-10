import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import { useState } from "react";
import { registerUser } from "../../service/auth-service";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    //lấy ra các key trong đối tượng values
    const { fullName, email, password, phone } = values;
    setLoading(true);
    const res = await registerUser(fullName, email, password, phone);
    if (res.data) {
      message.success({
        content: "Đăng ký thành công",
        style: {
          zIndex: 9999,
        },
      });
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      notification.error({
        message: "Lỗi đăng  ký",
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <>
      <div className={styles.container}>
        <Card
          className={styles.card}
          title="Đăng ký tài khoản"
          bordered={false}
        >
          <Form name="register" layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^\d{10}$/,
                  message: "Số điện thoại phải là 10 chữ số!",
                },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.button}
                loading={loading}
              >
                Đăng ký
              </Button>
              <div className={styles.loginRedirect}>
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;
