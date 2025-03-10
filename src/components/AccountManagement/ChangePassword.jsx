import { Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import styles from "./AccountManagement.module.css";
import { useSelector } from "react-redux";
import { changePassword } from "../../service/user-service";

const ChangePassword = () => {
  const { user } = useSelector((state) => state.account);
  const [passwordForm] = Form.useForm();

  const handleChangePassword = async (values) => {
    try {
      const data = {
        email: values.email,
        oldpass: values.currentPassword,
        newpass: values.newPassword,
      };

      await changePassword(data);
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields(["currentPassword", "newPassword"]);
    } catch (error) {
      message.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <Form
      form={passwordForm}
      layout="vertical"
      onFinish={handleChangePassword}
      className={styles.form}
      initialValues={{ email: user?.email }}
    >
      <Form.Item name="email" label="Email">
        <Input prefix={<MailOutlined />} disabled />
      </Form.Item>

      <Form.Item
        name="currentPassword"
        label="Mật khẩu hiện tại"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu hiện tại"
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu mới!" },
          { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          {
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            message:
              "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!",
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
