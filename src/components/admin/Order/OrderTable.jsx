import {
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  setCurrentPage,
  setPageSize,
  setQuerySearch,
  setSortField,
} from "../../../redux/ManageOrderAdmin/orderAdminSlice";
import OrderDetails from "./OrderDetails";

const OrderTable = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();
  const {
    data,
    currentPage,
    pageSize,
    totalData,
    querySearch,
    sortField,
    loading,
  } = useSelector((state) => state.orderAdmin);

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
      dispatch(setSortField(""));
    }
  };

  const handleExportData = () => {
    // Chỉ chọn các trường cụ thể từ dữ liệu gốc
    if (data.length > 0) {
      const filteredData = data.map(
        ({ _id, name, address, phone, totalPrice, updatedAt }) => ({
          ID: _id,
          "Tên người mua": name,
          "Địa chỉ": address,
          "Số điện thoại": phone,
          "Giá tiền": totalPrice,
          "Ngày cập nhật": moment(updatedAt).format("DD/MM/YYYY HH:mm:ss"),
        })
      );
      // Tạo worksheet từ dữ liệu JSON
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      // Tạo workbook mới
      const workbook = XLSX.utils.book_new();
      // Thêm worksheet vào workbook với tên "Sheet1"
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      // Ghi workbook thành file .csv và tải xuống
      XLSX.writeFile(workbook, "Orders.csv", { bookType: "csv" });
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
              setSelectedOrder(record);
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
      title: "Tên người mua",
      dataIndex: "name",
      sorter: true,
      ellipsis: true,
      width: 200, // Tăng kích thước cho cột này
      render: (_, record) => (
        <Tooltip title={record.name}>
          <span
            style={{
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.name}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: true,
      ellipsis: true,
      width: 160, // Tăng kích thước cho cột này
      align: "center",
      render: (_, record) => (
        <Tooltip title={record.address}>
          <span
            style={{
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.address}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
      width: 160, // Tăng kích thước cho cột này
      align: "center",
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.phone}>
          <span
            style={{
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.phone}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
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
      width: 200, // Tăng kích thước cho cột này
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Tooltip title="Xem">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setIsDrawerVisible(true);
                setSelectedOrder(record);
              }}
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
                  dispatch(setSortField("-updatedAt"));
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
        <OrderDetails
          isDrawerVisible={isDrawerVisible}
          setIsDrawerVisible={setIsDrawerVisible}
          selectedOrder={selectedOrder}
        />
      </div>
    </>
  );
};

export default OrderTable;
