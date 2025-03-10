import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Row,
  Col,
  Select,
  Image,
  message,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  createBook,
  getCategory,
  handleUploadFile,
} from "../../../service/book-service";
import { fetchAllBooks, setCurrentPage } from "../../../redux/book/bookSlice";
import { useDispatch, useSelector } from "react-redux";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [sliderFileList, setSliderFileList] = useState([]);

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentPage, pageSize, querySearch, sortField } = useSelector(
    (state) => state.book
  );
  const dispatch = useDispatch();

  useEffect(() => {
    handelGetCategory();
  }, []);

  const handelGetCategory = async () => {
    const res = await getCategory();
    if (res.data) {
      setCategories(res.data);
    }
  };

  const handleCancel = () => {
    setOpenModalCreate(false);
    form.resetFields();
    setThumbnailFileList([]); // Đặt lại fileList của ảnh thumbnail
    setSliderFileList([]); // Đặt lại fileList của ảnh slider
    setDataThumbnail([]);
    setDataSlider([]);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { mainText, price, sold, quantity, category, author } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);
        setLoading(true);
        const res = await createBook(
          thumbnail,
          slider,
          mainText,
          author,
          price,
          sold,
          quantity,
          category
        );
        if (res.data) {
          notification.success({
            message: "Tạo sách thành công!",
          });

          if (currentPage !== 1) {
            dispatch(setCurrentPage(1));
          } else {
            dispatch(
              fetchAllBooks({ currentPage, pageSize, querySearch, sortField })
            );
          }
          setLoading(false);
          handleCancel();
        } else {
          notification.error({
            message: "Tạo sách thất bại!",
            description: JSON.stringify(res.message),
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const beforeUpload = (file) => {
    file.status = "uploading";
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };

  const handleUploadFileRequest = async ({ file, onSuccess, type }) => {
    setTimeout(() => {
      file.status = "done"; // Cập nhật trạng thái thành 'done'
      onSuccess("ok"); // Cập nhật onSuccess để có thể hiển thị ảnh
    }, 2000);
    const res = await handleUploadFile(file, type);

    if (res.data) {
      return res.data.fileUploaded;
    }
    return null;
  };

  const handleUploadThumbnailList = async ({ file, onSuccess }) => {
    const uploadedFile = await handleUploadFileRequest({
      file,
      onSuccess,
      type: "book",
    });
    if (uploadedFile) {
      message.success(`Upload thành công: ${uploadedFile}`);
      setDataThumbnail([{ uid: file.uid, name: uploadedFile }]);
    }
  };

  const handleUploadSlider = async ({ file, onSuccess }) => {
    const uploadedFile = await handleUploadFileRequest({
      file,
      onSuccess,
      type: "book",
    });
    if (uploadedFile) {
      message.success(`Upload thành công: ${uploadedFile}`);
      setDataSlider((prevData) => [
        ...prevData,
        { uid: file.uid, name: uploadedFile },
      ]);
    }
  };

  return (
    <>
      <Modal
        visible={openModalCreate}
        title="Thêm mới sách"
        okText="Tạo mới"
        cancelText="Hủy"
        onCancel={handleCancel}
        onOk={handleSubmit}
        width="50vw" // Tăng chiều rộng của modal để đảm bảo nội dung không bị quá chật
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" name="form_add_book">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mainText"
                label="Tên sách"
                rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
              >
                <Input placeholder="Nhập tên sách" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Tác giả"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tác giả!" },
                ]}
              >
                <Input placeholder="Nhập tên tác giả" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá tiền (VND)"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập giá tiền"
                  addonAfter="VND"
                  min={0}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) => value.replace(/\,/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Thể loại"
                rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
              >
                <Select placeholder="Chọn thể loại" showSearch allowClear>
                  {categories.map((category, index) => (
                    <Option key={index} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập số lượng"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="sold"
                label="Đã bán"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng đã bán!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập số lượng đã bán"
                  min={0}
                  defaultValue={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ảnh Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên ảnh thumbnail!",
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  onPreview={handlePreview}
                  fileList={thumbnailFileList}
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) =>
                    setThumbnailFileList(fileList.slice(-1))
                  }
                  customRequest={handleUploadThumbnailList}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ảnh Slider">
                <div style={{ maxHeight: 150, overflowY: "auto" }}>
                  <Upload
                    listType="picture-card"
                    multiple
                    onPreview={handlePreview}
                    fileList={sliderFileList}
                    beforeUpload={beforeUpload}
                    onChange={({ fileList }) => setSliderFileList(fileList)}
                    customRequest={handleUploadSlider}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form>
      </Modal>
    </>
  );
};

export default BookModalCreate;
