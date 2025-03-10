import { Modal, Tabs } from "antd";
import UpdateInfo from "./UpdateInfo";
import ChangePassword from "./ChangePassword";
import styles from "./AccountManagement.module.css";
import { useRef } from "react";

const AccountManagement = (props) => {
  const { isAccountModalVisible, setIsAccountModalVisible } = props;
  const updateInfoRef = useRef();

  const handleModalClose = () => {
    updateInfoRef.current?.resetAll();
    setIsAccountModalVisible(false);
  };

  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: (
        <UpdateInfo
          ref={updateInfoRef}
          onModalClose={() => setIsAccountModalVisible(false)}
        />
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ChangePassword />,
    },
  ];

  return (
    <Modal
      open={isAccountModalVisible}
      title="Quản lý tài khoản"
      onOk={handleModalClose}
      onCancel={handleModalClose}
      width="90vw"
      maxWidth={800}
      footer={null}
      className={styles.accountModal}
    >
      <Tabs items={items} defaultActiveKey="1" />
    </Modal>
  );
};

export default AccountManagement;
