import { Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { updateUser } from "../../../service/user-service";
import { handleRefreshToken } from "../../../service/auth-service";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../../redux/account/accountSlice";
import { fetchAllUsers } from "../../../redux/user/userSlice";

const UserUpdateModal = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataUserUpdate,
    setDataUserUpdate,
  } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const idUser = useSelector((state) => state.account.user.id);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, pageSize, querySearch, sortField } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (dataUserUpdate) {
      form.setFieldsValue(dataUserUpdate);
    }
  }, [dataUserUpdate]); // Chạy khi dataUpdate thay đổi

  // Đóng modal
  const handleCancel = () => {
    setOpenModalUpdate(false);
    setDataUserUpdate(null);
  };

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      const { fullName, phone } = values;
      const id = dataUserUpdate._id;
      setIsLoading(true);
      const res = await updateUser(id, fullName, phone);
      if (res.data) {
        showNotification(
          "success",
          "Cập nhật thành công!",
          "Cập nhật người dùng thành công"
        );
        //kiếm tra người dùng trong state redux có id bằng với id đang chỉnh sửa thì mới cập nhật lại state
        if (id === idUser) {
          dispatch(updateUserInfo({ fullName: fullName, phone: phone }));
          // vì token đang lưu fullName của người dùng, nên sẽ phải update lại token
          const newToken = await handleRefreshToken();
          if (newToken) {
            // await handleGetAllUser();
            dispatch(
              fetchAllUsers({ currentPage, pageSize, querySearch, sortField })
            );
          }
        } else {
          dispatch(
            fetchAllUsers({ currentPage, pageSize, querySearch, sortField })
          );
        }
      } else {
        showNotification(
          "error",
          "Cập nhật thất bại!",
          JSON.stringify(res.message)
        );
      }
      setIsLoading(false);
      handleCancel();
    });
  };
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };
  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        visible={openModalUpdate}
        onCancel={handleCancel}
        onOk={handleUpdate}
        okText="Cập nhật"
        cancelText="Hủy"
        maskClosable={false}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserUpdateModal;
