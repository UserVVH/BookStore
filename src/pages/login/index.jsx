import { Card, Form, Input, Button, message, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { useState } from "react";
import { loginUser } from "../../service/auth-service";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    setLoading(true);
    const { username, password } = values;
    const res = await loginUser(username, password);
    if (res.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLoginAction(res.data.user));
      message.success({
        content: "Đăng nhập thành công",
        style: {
          zIndex: 9999,
        },
      });
      navigate("/");
    } else {
      notification.error({
        message: "Lỗi đăng nhập",
        description: JSON.stringify(res.message),
      });
    }
    setLoading(false);
  };
  return (
    <>
      <div className={styles.container}>
        <Card className={styles.card} title="Đăng nhập" bordered={false}>
          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="username"
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
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.button}
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className={styles.registerRedirect}>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
