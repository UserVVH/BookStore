import {
  Table,
  Button,
  Pagination,
  Select,
  Col,
  Space,
  Row,
  Tooltip,
  Popconfirm,
  notification,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import UserDetails from "./UserDetails";
import { useState } from "react";
import UserModalCreate from "./UserModalCreate";
import UserImportModal from "./UserImportModal";
import moment from "moment";
import * as XLSX from "xlsx";
import UserUpdateModal from "./UserUpdateModal";
import { deleteUser } from "../../../service/user-service";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  setCurrentPage,
  setPageSize,
  setQuerySearch,
  setSortField,
} from "../../../redux/user/userSlice";

const { Option } = Select;

const UserTable = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUserUpdate, setDataUserUpdate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();
  const {
    data,
    currentPage,
    pageSize,
    totalData,
    querySearch,
    sortField,
    loading,
  } = useSelector((state) => state.user);

  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value));
    // Reset về trang đầu khi thay đổi số mục mỗi trang
    dispatch(setCurrentPage(1));
  };

  // Xử lý thay đổi sắp xếp
  const handleSort = async (pagination, filters, sorter, extra) => {
    if (sorter.order === "ascend") {
      dispatch(setSortField(sorter.field));
    } else if (sorter.order === "descend") {
      dispatch(setSortField(`-${sorter.field}`));
    } else {
      // setCurrentPage(1);
      // setPageSize(5);
      // setQuerySearch("");
      dispatch(setSortField(""));
      // setSortField("");
    }
  };

  const handleExportData = () => {
    // Chỉ chọn các trường cụ thể từ dữ liệu gốc
    if (data.length > 0) {
      const filteredData = data.map(
        ({ _id, fullName, email, phone, createdAt, updatedAt }) => ({
          _id,
          fullName,
          email,
          phone,
          createdAt: moment(createdAt).format("DD/MM/YYYY HH:mm:ss"),
          updatedAt: moment(updatedAt).format("DD/MM/YYYY HH:mm:ss"),
        })
      );
      // Tạo worksheet từ dữ liệu JSON
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      // Tạo workbook mới
      const workbook = XLSX.utils.book_new();
      // Thêm worksheet vào workbook với tên "Sheet1"
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      // Ghi workbook thành file .csv và tải xuống
      XLSX.writeFile(workbook, "User.csv", { bookType: "csv" });
    }
  };

  const handleDeleteUser = async (id) => {
    const res = await deleteUser(id);
    if (res.data) {
      notification.success({
        message: "delete user success",
        description: "xóa người dùng thành công",
      });
      // Kiểm tra số phần tử hiện tại để quyết định cập nhật trang
      const totalItems = totalData - 1; // Sau khi xóa
      const totalPages = Math.ceil(totalItems / pageSize); // pageSize là số phần tử mỗi trang

      if (currentPage > totalPages) {
        dispatch(setCurrentPage(currentPage - 1));
      } else {
        dispatch(
          fetchAllUsers({ currentPage, pageSize, querySearch, sortField })
        );
      }
    } else {
      notification.error({
        message: "Error delete user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      align: "center",
      width: 210,
      render: (_, record) => (
        <Tooltip title={record._id}>
          <a
            onClick={() => {
              setIsDrawerVisible(true);
              setSelectedUser(record);
            }}
            style={{
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record._id}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
      ellipsis: true,
      width: 200, // Tăng kích thước cho cột này
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      ellipsis: true,
      width: 250, // Tăng kích thước cho cột này
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
      width: 160, // Tăng kích thước cho cột này
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      width: 180, // Tăng kích thước cho cột này
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 300, // Tăng kích thước cho cột này
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Tooltip title="Xem">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setIsDrawerVisible(true);
                setSelectedUser(record);
              }}
              style={{ padding: "0 10px" }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUserUpdate(record);
              }}
              style={{ padding: "0 10px" }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="primary"
              danger
              icon={
                <Popconfirm
                  title="Bạn có chắc muốn xóa người dùng này không?"
                  onConfirm={() => handleDeleteUser(record._id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  placement="left" // Đặt vị trí của popup
                >
                  <DeleteOutlined />
                </Popconfirm>
              }
              style={{ padding: "0 10px" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        {/* Header với các nút Export, Import, và Thêm Mới */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "20px" }}
        >
          {/* <Col>
            <h2 style={{ margin: 0 }}>Table Users</h2>
          </Col> */}
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  color: "white",
                }}
                onClick={handleExportData}
              >
                Export
              </Button>
              <Button
                type="primary"
                icon={<ImportOutlined />}
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  color: "white",
                }}
                onClick={() => setOpenModalImport(true)}
              >
                Import
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "#faad14",
                  borderColor: "#faad14",
                  color: "white",
                }}
                onClick={() => setOpenModalCreate(true)}
              >
                Thêm Mới
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  color: "white",
                }}
                onClick={() => {
                  dispatch(setCurrentPage(1));
                  dispatch(setPageSize(5));
                  dispatch(setQuerySearch(""));
                  dispatch(setSortField(""));
                }}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="_id"
          loading={loading}
          onChange={handleSort}
          bordered
          scroll={{ y: 300 }}
          style={{
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
      {/* Pagination & Page Size Selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalData}
          onChange={(page) => dispatch(setCurrentPage(page))}
          showSizeChanger={false}
          showQuickJumper
        />
        <Select
          defaultValue={5}
          onChange={handlePageSizeChange}
          style={{ width: 120 }}
        >
          <Option value={5}>5 / page</Option>
          <Option value={10}>10 / page</Option>
          <Option value={20}>20 / page</Option>
          <Option value={50}>50 / page</Option>
          <Option value={100}>100 / page</Option>
        </Select>
      </div>
      {/* xem chi tiết người dùng */}
      <UserDetails
        isDrawerVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        selectedUser={selectedUser}
      />
      {/* thêm mới người dùng bằng form */}
      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      />
      {/* thêm người dùng từ file excel */}
      <UserImportModal
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
      />

      {/* cập nhật người dùng */}
      <UserUpdateModal
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUserUpdate={dataUserUpdate}
        setDataUserUpdate={setDataUserUpdate}
      />
    </>
  );
};

export default UserTable;
