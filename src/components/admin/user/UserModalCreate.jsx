import { Modal, Form, Input, Button, notification, Divider } from "antd";
import { createUser } from "../../../service/user-service";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, setCurrentPage } from "../../../redux/user/userSlice";

const UserModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const dispatch = useDispatch();
  const { currentPage, pageSize, totalData, querySearch, sortField } =
    useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Hàm đóng modal
  const handleCancel = () => {
    setOpenModalCreate(false);
    form.resetFields();
  };

  // Hàm submit form
  const handleSubmit = async (values) => {
    const { fullName, password, email, phone } = values;
    setIsLoading(true);
    const res = await createUser(fullName, password, email, phone);
    if (res.data) {
      notification.success({
        message: "Tạo mới thành công!",
        description: "Tạo mới người dùng thành công",
      });
      // Tổng số phần tử sau khi tạo mới
      const totalItems = totalData + 1; // +1 vì đã thêm phần tử mới
      // Tính toán số trang cuối cùng
      const lastPage = Math.ceil(totalItems / pageSize);

      // Nếu số phần tử đạt tới giới hạn của trang hiện tại, chuyển đến trang cuối
      if (totalItems > pageSize * currentPage) {
        dispatch(setCurrentPage(lastPage));
      } else {
        dispatch(
          fetchAllUsers({ currentPage, pageSize, querySearch, sortField })
        );
      }
      form.resetFields();
      handleCancel();
    } else {
      notification.error({
        message: "Lỗi tạo người dùng!",
        description: JSON.stringify(res.message),
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // form.resetFields();
    // handleCancel();
  };
  return (
    <div style={{ padding: "20px" }}>
      {/* Modal */}
      <Modal
        title="Đăng Ký Người Dùng Mới"
        visible={openModalCreate}
        onCancel={handleCancel}
        footer={null}
        width={500}
        maskClosable={false}
      >
        <Divider />
        <div>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            {/* Tên hiển thị */}
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  Tên hiển thị
                </span>
              }
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị!" },
              ]}
            >
              <Input placeholder="Nhập tên hiển thị" />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  Mật khẩu
                </span>
              }
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  Số điện thoại
                </span>
              }
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            {/* Nút tạo mới và hủy */}
            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="default"
                onClick={handleCancel}
                style={{
                  marginRight: "10px",
                  fontSize: "16px",
                  padding: "10px 20px",
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ fontSize: "16px", padding: "10px 20px" }}
                loading={isLoading}
              >
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UserModalCreate;
