import { Form, Input, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import {
  setCurrentPage,
  setPageSize,
  setQuerySearch,
} from "../../../redux/ManageOrderAdmin/orderAdminSlice";

const OrderSearch = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    // Lấy giá trị từ form
    const values = form.getFieldsValue();
    const { name, phone, address } = values;

    if (!name && !phone && !address) {
      message.warning("Vui lòng nhập ít nhất một trường để tìm kiếm.");
      return;
    }

    // Tạo query string cho API
    const query = new URLSearchParams({
      ...(name && { name: `/${name}/i` }), // tìm kiếm tương đối cho tên người mua
      ...(phone && { phone: `/${phone}/i` }), // tìm kiếm tương đối cho số điện thoại
      ...(address && { address: `/${address}/i` }), // tìm kiếm tương đối cho địa chỉ
    }).toString();
    dispatch(setQuerySearch(query));

    //backend code lỗi nên phải set lại current và page size
    dispatch(setCurrentPage(1));
    dispatch(setPageSize(5));
  };

  const handleClear = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleSearch}
      style={{
        background: "#f0f5ff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row gutter={16} style={{ width: "100%" }}>
        <Col span={7}>
          <Form.Item
            name="name"
            label={
              <span
                style={{
                  fontSize: "16px",
                  color: "#3a3a3a",
                  fontWeight: "500",
                }}
              >
                Tên người mua
              </span>
            }
          >
            <Input
              placeholder="Nhập tên người mua"
              style={{
                fontSize: "16px",
                color: "#333",
                backgroundColor: "#ffffff",
                borderColor: "#1890ff",
                padding: "8px 12px",
                borderRadius: "4px",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="phone"
            label={
              <span
                style={{
                  fontSize: "16px",
                  color: "#3a3a3a",
                  fontWeight: "500",
                }}
              >
                Số điện thoại
              </span>
            }
          >
            <Input
              placeholder="Nhập số điện thoại"
              style={{
                fontSize: "16px",
                color: "#333",
                backgroundColor: "#ffffff",
                borderColor: "#1890ff",
                padding: "8px 12px",
                borderRadius: "4px",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            name="address"
            label={
              <span
                style={{
                  fontSize: "16px",
                  color: "#3a3a3a",
                  fontWeight: "500",
                }}
              >
                Địa chỉ
              </span>
            }
          >
            <Input
              placeholder="Nhập địa chỉ"
              style={{
                fontSize: "16px",
                color: "#333",
                backgroundColor: "#ffffff",
                borderColor: "#1890ff",
                padding: "8px 12px",
                borderRadius: "4px",
              }}
            />
          </Form.Item>
        </Col>
        <Col
          span={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 16px",
              width: "100%",
              borderRadius: "4px",
            }}
          >
            Search
          </Button>
          <Button
            onClick={handleClear}
            style={{
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 16px",
              width: "100%",
              marginLeft: "8px",
              borderRadius: "4px",
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderSearch;
