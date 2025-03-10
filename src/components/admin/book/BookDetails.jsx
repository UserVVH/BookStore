import { Badge, Descriptions, Divider, Drawer, Image, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookDetails = (props) => {
  const { isDrawerVisible, setIsDrawerVisible, selectedBook } = props;
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (selectedBook) {
      const images = [
        selectedBook.thumbnail,
        ...(selectedBook.slider || []),
      ].map((image) => ({
        uid: uuidv4(),
        name: image,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${image}`,
      }));
      setFileList(images);
    }
  }, [selectedBook]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <Drawer
        title="Chi tiết sách"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        width="50vw"
      >
        {selectedBook ? (
          <>
            <Descriptions
              bordered
              size="middle"
              column={{ xs: 1, sm: 2, md: 2 }}
              layout="vertical"
              labelStyle={{ backgroundColor: "#f0f2f5", fontWeight: "bold" }}
              contentStyle={{ backgroundColor: "#ffffff" }}
            >
              <Descriptions.Item label="ID" span={2}>
                {selectedBook._id}
              </Descriptions.Item>
              <Descriptions.Item label="Tên sách">
                {selectedBook.mainText}
              </Descriptions.Item>
              <Descriptions.Item label="Tác giả">
                {selectedBook.author}
              </Descriptions.Item>
              <Descriptions.Item label="Giá tiền">
                {selectedBook.price}
              </Descriptions.Item>
              <Descriptions.Item label="Thể loại">
                {selectedBook.category}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {selectedBook.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Đã bán">
                {selectedBook.sold}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {moment(selectedBook.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {moment(selectedBook.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Ảnh Books</Divider>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              showUploadList={{ showRemoveIcon: false }}
            />
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
          </>
        ) : (
          <p>Không có thông tin sách để hiển thị</p>
        )}
      </Drawer>
    </>
  );
};

export default BookDetails;
