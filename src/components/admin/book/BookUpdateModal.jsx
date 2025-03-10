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
  Button,
} from "antd";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getCategory,
  handleUploadFile,
  updateBook,
} from "../../../service/book-service";
import { fetchAllBooks, setCurrentPage } from "../../../redux/book/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookUpdateModal = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataBookUpdate,
    setDataBookUpdate,
  } = props;
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [sliderFileList, setSliderFileList] = useState([]);

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedThumbnails, setSelectedThumbnails] = useState([]);
  const [selectedSliders, setSelectedSliders] = useState([]);

  const { currentPage, pageSize, querySearch, sortField } = useSelector(
    (state) => state.book
  );
  const dispatch = useDispatch();

  useEffect(() => {
    handelGetCategory();
  }, []);

  useEffect(() => {
    if (dataBookUpdate) {
      // Set initial form values
      form.setFieldsValue({
        mainText: dataBookUpdate.mainText,
        author: dataBookUpdate.author,
        price: dataBookUpdate.price
          ?.toString()
          .replace(/[^0-9,.]/g, "") // Remove all characters except numbers, commas and dots
          .replace(/\./g, ","), // Replace dots with commas
        category: dataBookUpdate.category,
        quantity: dataBookUpdate.quantity,
        sold: dataBookUpdate.sold,
      });

      // Set initial thumbnail
      if (dataBookUpdate.thumbnail) {
        setThumbnailFileList([
          {
            uid: uuidv4(),
            name: dataBookUpdate.thumbnail,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
              dataBookUpdate.thumbnail
            }`,
          },
        ]);
        setDataThumbnail([{ name: dataBookUpdate.thumbnail }]);
      }

      // Set initial slider images with UIDs
      if (dataBookUpdate.slider && dataBookUpdate.slider.length > 0) {
        const sliderImages = dataBookUpdate.slider.map((image) => {
          // Generate a unique ID for each image
          const uid = uuidv4();
          return {
            uid: uid,
            name: image,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${image}`,
          };
        });
        setSliderFileList(sliderImages);
        // Set initial data slider with UIDs to match
        setDataSlider(sliderImages.map(({ uid, name }) => ({ uid, name })));
        // Initially select all existing images
        setSelectedSliders(sliderImages.map((img) => img.uid));
      }
    }
  }, [dataBookUpdate]);

  const handelGetCategory = async () => {
    const res = await getCategory();
    if (res.data) {
      setCategories(res.data);
    }
  };

  const handleCancel = () => {
    setOpenModalUpdate(false);
    form.resetFields();
    setThumbnailFileList([]);
    setSliderFileList([]);
    setDataThumbnail([]);
    setDataSlider([]);
    setDataBookUpdate(null);
    setSelectedThumbnails([]);
    setSelectedSliders([]);
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
        // Get only selected thumbnail and slider images
        const selectedThumbnailData = dataThumbnail.filter((item) =>
          selectedThumbnails.includes(item.uid)
        );

        // Filter dataSlider to only include selected images
        const selectedSliderData = dataSlider.filter((item) =>
          selectedSliders.includes(item.uid)
        );

        const formattedPrice = parseInt(
          values.price?.toString().replace(/,/g, "")
        );
        const { mainText, sold, quantity, category, author } = values;

        // Use the first selected thumbnail or fallback to existing one
        const thumbnail =
          selectedThumbnailData.length > 0
            ? selectedThumbnailData[0].name
            : dataBookUpdate.thumbnail;

        // Only use the selected slider images (no fallback)
        const slider = selectedSliderData.map((item) => item.name);

        setLoading(true);
        const res = await updateBook(
          dataBookUpdate._id,
          thumbnail,
          slider, // This will now only contain the selected images
          mainText,
          author,
          formattedPrice,
          sold,
          quantity,
          category
        );

        if (res.data) {
          notification.success({
            message: "Cập nhật sách thành công!",
          });
          dispatch(setCurrentPage(1));
          dispatch(
            fetchAllBooks({ currentPage, pageSize, querySearch, sortField })
          );
          setLoading(false);
          handleCancel();
        } else {
          notification.error({
            message: "Cập nhật sách thất bại!",
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
      file.status = "done";
      onSuccess("ok");
    }, 2000);
    const res = await handleUploadFile(file, type);

    if (res.data) {
      return res.data.fileUploaded;
    }
    return null;
  };

  const handleUploadThumbnailList = async ({ file, onSuccess }) => {
    // Just add the file to the list without uploading
    setTimeout(() => {
      file.status = "done";
      onSuccess("ok");
    }, 0);
  };

  const handleSliderSelect = async (file) => {
    if (selectedSliders.includes(file.uid)) {
      setSelectedSliders(selectedSliders.filter((id) => id !== file.uid));
    } else {
      setSelectedSliders([...selectedSliders, file.uid]);

      // Upload the file if it's a new file
      if (file.originFileObj) {
        const uploadedFile = await handleUploadFileRequest({
          file: file.originFileObj,
          onSuccess: () => {
            file.status = "done";
          },
          type: "book",
        });

        if (uploadedFile) {
          message.success(`Upload thành công: ${uploadedFile}`);
          setDataSlider((prevData) => [
            ...prevData,
            { uid: file.uid, name: uploadedFile },
          ]);
        }
      }
    }
  };

  const handleUploadSlider = async ({ file, onSuccess }) => {
    // Just add the file to the list without uploading
    setTimeout(() => {
      file.status = "done";
      onSuccess("ok");
    }, 0);
  };

  // Add new handlers for selection
  const handleThumbnailSelect = async (file) => {
    if (selectedThumbnails.includes(file.uid)) {
      setSelectedThumbnails([]);
    } else {
      if (selectedThumbnails.length >= 1) {
        message.warning("Chỉ được chọn 1 ảnh Thumbnail!");
        return;
      }
      setSelectedThumbnails([file.uid]);

      // Upload the file if it's a new file
      if (file.originFileObj) {
        const uploadedFile = await handleUploadFileRequest({
          file: file.originFileObj,
          onSuccess: () => {
            file.status = "done";
          },
          type: "book",
        });

        if (uploadedFile) {
          message.success(`Upload thành công: ${uploadedFile}`);
          setDataThumbnail([{ uid: file.uid, name: uploadedFile }]);
        }
      }
    }
  };

  const handleClearSelection = (type) => {
    if (type === "thumbnail") {
      setSelectedThumbnails([]);
    } else {
      setSelectedSliders([]);
    }
  };

  const renderUploadItem = (originNode, file, type) => {
    const isSelected =
      type === "thumbnail"
        ? selectedThumbnails.includes(file.uid)
        : selectedSliders.includes(file.uid);

    return (
      <div
        className="custom-upload-item"
        style={{
          position: "relative",
          display: "inline-block",
          width: 102,
          height: 102,
          marginRight: 8,
          marginBottom: 8,
        }}
      >
        {originNode}
        <Button
          type={isSelected ? "primary" : "default"}
          shape="circle"
          size="small"
          icon={<CheckOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            type === "thumbnail"
              ? handleThumbnailSelect(file)
              : handleSliderSelect(file);
          }}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            zIndex: 2,
            width: "24px",
            height: "24px",
            opacity: 0.8,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
    );
  };

  return (
    <Modal
      visible={openModalUpdate}
      title="Cập nhật sách"
      okText="Cập nhật"
      cancelText="Hủy"
      onCancel={handleCancel}
      onOk={handleSubmit}
      width="50vw"
      height="50vh"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="form_update_book">
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
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
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
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Ảnh Thumbnail">
              {/* new code */}
              <div style={{ marginBottom: 8 }}>
                <Button
                  size="small"
                  onClick={() => handleClearSelection("thumbnail")}
                  disabled={selectedThumbnails.length === 0}
                >
                  Bỏ chọn tất cả
                </Button>
              </div>
              <Upload
                listType="picture-card"
                onPreview={handlePreview}
                fileList={thumbnailFileList}
                beforeUpload={beforeUpload}
                multiple
                onChange={({ fileList }) => setThumbnailFileList(fileList)}
                customRequest={handleUploadThumbnailList}
                itemRender={(originNode, file) =>
                  renderUploadItem(originNode, file, "thumbnail")
                }
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
              <div style={{ marginBottom: 8 }}>
                <Button
                  size="small"
                  onClick={() => handleClearSelection("slider")}
                  disabled={selectedSliders.length === 0}
                >
                  Bỏ chọn tất cả
                </Button>
              </div>
              <div style={{ maxHeight: 150, overflowY: "auto" }}>
                <Upload
                  listType="picture-card"
                  multiple
                  onPreview={handlePreview}
                  fileList={sliderFileList}
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) => setSliderFileList(fileList)}
                  customRequest={handleUploadSlider}
                  itemRender={(originNode, file) =>
                    renderUploadItem(originNode, file, "slider")
                  }
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
  );
};

export default BookUpdateModal;
