import { Form, Input, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import {
  setCurrentPage,
  setPageSize,
  setQuerySearch,
} from "../../../redux/user/userSlice";

const UserSearch = () => {
  const [form] = Form.useForm();
  // const { setQuerySearch, setCurrentPage, setPageSize } = props;
  const dispatch = useDispatch();

  const handleSearch = async () => {
    // Lấy giá trị từ form
    const values = form.getFieldsValue();
    const { name, email, phone } = values;
    if (!name && !email && !phone) {
      message.warning("Vui lòng nhập ít nhất một trường để tìm kiếm.");
      return;
    }

    // Tạo query string cho API
    const query = new URLSearchParams({
      ...(name && { fullName: `/${name}/i` }), // tìm kiếm tương đối cho name
      ...(email && { email: `/${email}/i` }), // tìm kiếm tương đối cho email
      ...(phone && { phone: `/${phone}/i` }), // tìm kiếm tương đối cho phone
    }).toString();
    dispatch(setQuerySearch(query));
    // setQuerySearch(query);

    //backend code lỗi nên phải set lại current và page size
    // setCurrentPage(1);
    dispatch(setCurrentPage(1));
    dispatch(setPageSize(5));

    // setPageSize(5);
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
                Tên hiển thị
              </span>
            }
          >
            <Input
              placeholder="Enter name"
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
            name="email"
            label={
              <span
                style={{
                  fontSize: "16px",
                  color: "#3a3a3a",
                  fontWeight: "500",
                }}
              >
                Email
              </span>
            }
          >
            <Input
              placeholder="Enter email"
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
              placeholder="Enter phone number"
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

export default UserSearch;
