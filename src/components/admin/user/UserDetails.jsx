import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment";

const UserDetails = (props) => {
  const { isDrawerVisible, onClose, selectedUser } = props;
  return (
    <Drawer
      title="Chi tiết người dùng"
      placement="right"
      onClose={onClose}
      visible={isDrawerVisible}
      width="50vw"
    >
      {selectedUser ? (
        <Descriptions
          title="Chi tiết người dùng"
          bordered
          size="middle"
          column={{ xs: 1, sm: 2, md: 2 }}
          layout="vertical"
          labelStyle={{ backgroundColor: "#f0f2f5", fontWeight: "bold" }}
          contentStyle={{ backgroundColor: "#ffffff" }}
        >
          <Descriptions.Item label="ID" span={2}>
            {selectedUser._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {selectedUser.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {selectedUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {selectedUser.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Badge
              status={selectedUser.role === "ADMIN" ? "success" : "default"}
              text={selectedUser.role}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(selectedUser.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {moment(selectedUser.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có thông tin người dùng để hiển thị</p>
      )}
    </Drawer>
  );
};

export default UserDetails;
