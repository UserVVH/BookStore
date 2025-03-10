import { useState } from "react";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import {
  message,
  Upload,
  Modal,
  Button,
  Table,
  Progress,
  notification,
} from "antd";
import * as XLSX from "xlsx";
import { createUserBulk } from "../../../service/user-service";
import templateFile from "./templates/template.xlsx?url";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, setCurrentPage } from "../../../redux/user/userSlice";

const { Dragger } = Upload;

const UserImportModal = (props) => {
  const { openModalImport, setOpenModalImport } = props;
  const [fileList, setFileList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useDispatch();
  const { currentPage, pageSize, totalData, querySearch, sortField } =
    useSelector((state) => state.user);

  const handleFileChange = (info) => {
    const { status, name } = info.file;

    // Kiểm tra định dạng file
    const isValidFileType = (fileName) => {
      const validExtensions = [".csv", ".xlsx", ".xls"];
      const extension = fileName
        .slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase();
      return validExtensions.includes(`.${extension}`);
    };
    // Xử lý trạng thái upload
    if (status === "uploading") {
      if (!isValidFileType(name)) {
        message.error(
          `${name} không hợp lệ. Vui lòng tải lên .csv, .xlsx, hoặc .xls file.`
        );
        setFileList([]); // Xóa danh sách file nếu không hợp lệ
        return; // Dừng lại nếu file không hợp lệ
      }
    } else if (status === "done") {
      if (!isValidFileType(name)) {
        setFileList([]); // Xóa danh sách file nếu không hợp lệ
        return;
      }
      message.success(`${name} file uploaded successfully.`);

      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Giả định bạn muốn đọc sheet đầu tiên
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Ánh xạ dữ liệu từ Excel sang dataIndex trong columns table
        const mappedData = jsonData.map((row) => {
          return {
            fullName: (row["Tên hiển thị"] || "Chưa có tên").trim(), // Giá trị mặc định nếu không có
            password: "12345678", // pass mặc định cho user
            email: (row["Email"] || "Chưa có email").trim(), // Giá trị mặc định nếu không có
            phone: row["Số điện thoại"] || "Chưa có số điện thoại", // Giá trị mặc định nếu không có
          };
        });

        // Cập nhật dataSource với dữ liệu từ file
        setDataSource(mappedData);
      };

      // Đọc file dưới dạng nhị phân
      reader.readAsBinaryString(info.file.originFileObj);
    } else if (status === "error") {
      message.error(`${name} file upload failed.`);
    }

    // Cập nhật danh sách file đã chọn
    setFileList([info.file]); // Đảm bảo chỉ có 1 file trong danh sách
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      // Giả lập quá trình tải lên với thanh tiến trình
      let percent = 0;
      const interval = setInterval(() => {
        percent += 10; // Tăng phần trăm tiến trình
        setFileList((prev) =>
          prev.map((item) =>
            item.uid === file.uid
              ? { ...item, percent, status: "uploading" }
              : item
          )
        );

        if (percent >= 100) {
          clearInterval(interval);
          // Cập nhật trạng thái thành "done" khi hoàn tất
          setFileList((prev) =>
            prev.map((item) =>
              item.uid === file.uid
                ? { ...item, status: "done" } // Cập nhật trạng thái thành "done"
                : item
            )
          );
          onSuccess("ok"); // Gọi hàm onSuccess sau khi hoàn tất
        }
      }, 100); // Cập nhật mỗi 100ms
    }, 1000); // Giả lập thời gian tải lên 1 giây
  };

  const propsUpload = {
    name: "file",
    multiple: false, // Chỉ cho phép tải lên một file
    // accept: ".csv,.xlsx,.xls", // Chỉ chấp nhận các định dạng file này
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    showUploadList: false, // Không hiển thị danh sách file đã tải lên
    customRequest: dummyRequest, // Sử dụng dummyRequest để giả lập việc tải lên
    onChange: handleFileChange, // Hàm xử lý thay đổi khi file được chọn
  };
  const handleRemoveFile = (uid) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
    message.success("File đã được xóa thành công.");
  };

  const handleCancel = () => {
    setOpenModalImport(false);
    setFileList([]);
    setDataSource([]);
  };

  const handleImportUser = async () => {
    try {
      const res = await createUserBulk(dataSource);

      // Kiểm tra nếu có lỗi
      if (res.data) {
        const { countSuccess, countError } = res.data;

        if (countError) {
          showNotification(
            "error",
            "Upload thất bại!",
            `Dữ liệu trùng nhau: ${JSON.stringify(countError)}`
          );
        } else {
          showNotification(
            "success",
            "Upload thành công!",
            `Success: ${JSON.stringify(countSuccess)}, Error: ${JSON.stringify(
              countError
            )}`
          );
          // Tổng số phần tử sau khi tạo mới
          const totalItems = totalData + 1; // +1 vì đã thêm phần tử mới
          // Tính toán số trang cuối cùng
          const lastPage = Math.ceil(totalItems / pageSize);

          // Nếu số phần tử đạt tới giới hạn của trang hiện tại, chuyển đến trang cuối
          if (totalItems > pageSize * currentPage) {
            // setCurrentPage(lastPage); // Chuyển đến trang cuối cùng
            dispatch(setCurrentPage(lastPage));
          } else {
            // await handleGetAllUser();
            dispatch(
              fetchAllUsers({ currentPage, pageSize, querySearch, sortField })
            );
          }
          handleCancel();
        }
      } else {
        showNotification(
          "error",
          "Lỗi tạo người dùng!",
          JSON.stringify(res.message)
        );
      }
    } catch (error) {
      showNotification(
        "error",
        "Đã xảy ra lỗi!",
        error.message || "Không xác định"
      );
    }
  };

  // Hàm hiển thị thông báo
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const columns = [
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
  ];

  return (
    <>
      <Modal
        title="Import data user"
        visible={openModalImport}
        onCancel={handleCancel}
        okText="Import data"
        onOk={handleImportUser} // Gọi hàm khi nhấn nút OK
        width={800}
        maskClosable={false}
        okButtonProps={{
          disabled: dataSource.length < 1,
        }}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click hoặc kéo file vào khu vực này để tải lên
          </p>
          <p
            className="ant-upload-hint"
            style={{
              fontWeight: "bold",
              color: "#ff4d4f",
              backgroundColor: "#fff0f0" /* Nền nhạt */,
              border: "1px dashed #ff4d4f" /* Viền đứt */,
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px" /* Khoảng cách với các phần khác */,
              fontSize: "17px",
            }}
          >
            Vui lòng chọn file có định dạng: <strong>.csv, .xlsx, .xls</strong>.{" "}
            <a
              onClick={(e) => e.stopPropagation()}
              href={templateFile}
              download
              style={{ color: "#1890ff", textDecoration: "none" }}
            >
              Tải xuống mẫu file Excel
            </a>
          </p>
        </Dragger>

        <div style={{ marginTop: 20 }}>
          {/* <h3>Dữ liệu upload</h3> */}
          {fileList.length > 0 && (
            <ul>
              {fileList.map((file) => (
                <li key={file.uid}>
                  {file.name}
                  {file.status === "uploading" ? (
                    <Progress percent={file.percent} />
                  ) : file.status === "done" ? (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        handleRemoveFile(file.uid);
                        setDataSource([]);
                      }}
                      type="link"
                    >
                      Xóa
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ y: 300 }}
          />
        </div>

        {/* <div style={{ marginTop: 20, textAlign: "right" }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleImportUser}>
            Import data
          </Button>
        </div> */}
      </Modal>
    </>
  );
};

export default UserImportModal;
