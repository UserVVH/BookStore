import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Image,
  notification,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import styles from "./AccountManagement.module.css";
import { useDispatch, useSelector } from "react-redux";
import { handleUploadFile, updateUser } from "../../service/user-service";
import { updateUserInfo } from "../../redux/account/accountSlice";
import { handleRefreshToken } from "../../service/auth-service";

const useAvatarUpload = (user, dispatch) => {
  const getInitialState = () => ({
    avatarUrl: `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
      user?.avatar
    }`,
    previewUrl: null,
    isSelectingPhoto: false,
    selectedFile: null,
  });

  const [avatarState, setAvatarState] = useState(getInitialState());

  const resetAvatarState = () => {
    setAvatarState(getInitialState());
  };

  const handleUploadRequest = ({ file, onSuccess }) => {
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được phép tải lên file ảnh!");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setAvatarState((prev) => ({
        ...prev,
        previewUrl: reader.result,
        isSelectingPhoto: true,
        selectedFile: file,
      }));
      onSuccess("ok");
    });

    reader.addEventListener("error", () => {
      message.error("Tải ảnh lên thất bại.");
    });

    reader.readAsDataURL(file);
  };

  const handleConfirmPhoto = async () => {
    try {
      const { previewUrl, selectedFile } = avatarState;
      const base64Response = await fetch(previewUrl);
      const blob = await base64Response.blob();
      const file = new File([blob], selectedFile.name, {
        type: selectedFile.type,
      });

      const uploadRes = await handleUploadFile(file, "avatar");
      if (!uploadRes.data) throw new Error("Upload failed");

      const updateRes = await updateUser(
        user.id,
        user.fullName,
        user.phone,
        uploadRes.data.fileUploaded
      );

      if (!updateRes.data) throw new Error(updateRes.message);

      // const newToken = await handleRefreshToken();
      // if (!newToken) throw new Error("Token refresh failed");
      localStorage.removeItem("access_token");

      dispatch(updateUserInfo({ avatar: uploadRes.data.fileUploaded }));
      setAvatarState((prev) => ({
        ...prev,
        avatarUrl: previewUrl,
        previewUrl: null,
        isSelectingPhoto: false,
        selectedFile: null,
      }));
      message.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      notification.error({
        message: "Cập nhật ảnh đại diện thất bại!",
        description: error.message,
      });
    }
  };

  const handleCancelPhoto = () => {
    setAvatarState((prev) => ({
      ...prev,
      previewUrl: null,
      isSelectingPhoto: false,
      selectedFile: null,
    }));
    message.info("Đã hủy chọn ảnh");
  };

  return {
    avatarState,
    handleUploadRequest,
    handleConfirmPhoto,
    handleCancelPhoto,
    resetAvatarState,
  };
};

const UpdateInfo = forwardRef(({ onModalClose }, ref) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);
  const [updateForm] = Form.useForm();

  const {
    avatarState,
    handleUploadRequest,
    handleConfirmPhoto,
    handleCancelPhoto,
    resetAvatarState,
  } = useAvatarUpload(user, dispatch);

  const resetForm = () => {
    updateForm.setFieldsValue({
      email: user?.email,
      displayName: user?.fullName,
      phone: user?.phone,
    });
  };

  // Expose resetAvatarState and resetForm to parent through ref
  useImperativeHandle(ref, () => ({
    // resetAvatarState,
    resetAll: () => {
      resetAvatarState();
      resetForm();
    },
  }));

  const handleClose = () => {
    resetAvatarState();
    resetForm();
    onModalClose?.();
  };

  const handleUpdateInfo = async (values) => {
    if (avatarState.isSelectingPhoto) {
      message.warning(
        "Vui lòng xác nhận ảnh đại diện trước khi cập nhật thông tin!"
      );
      return;
    }

    try {
      const updateRes = await updateUser(
        user.id,
        values.displayName,
        values.phone
      );
      if (!updateRes.data) throw new Error(updateRes.message);

      // const newToken = await handleRefreshToken();
      // if (!newToken) throw new Error("Token refresh failed");
      localStorage.removeItem("access_token");

      dispatch(
        updateUserInfo({
          fullName: values.displayName,
          phone: values.phone,
        })
      );

      message.success("Cập nhật thông tin thành công!");
      handleClose();
    } catch (error) {
      notification.error({
        message: "Cập nhật thông tin thất bại!",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    return () => {
      resetAvatarState();
    };
  }, []);

  return (
    <Form
      form={updateForm}
      layout="vertical"
      onFinish={handleUpdateInfo}
      className={styles.form}
      initialValues={{
        email: user?.email,
        displayName: user?.fullName,
        phone: user?.phone,
      }}
    >
      <div className={styles.desktopLayout}>
        <div className={styles.avatarSection}>
          {(
            avatarState.isSelectingPhoto
              ? avatarState.previewUrl
              : avatarState.avatarUrl
          ) ? (
            <Image
              src={
                avatarState.isSelectingPhoto
                  ? avatarState.previewUrl
                  : avatarState.avatarUrl
              }
              preview={{
                mask: "Xem ảnh",
                maskClassName: styles.previewMask,
              }}
              className={styles.avatar}
              width={150}
              height={150}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <Avatar
              size={150}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
          )}
          <div className={styles.uploadButtons}>
            {avatarState.isSelectingPhoto ? (
              <>
                <Button type="primary" onClick={handleConfirmPhoto}>
                  Xác nhận ảnh
                </Button>
                <Button onClick={handleCancelPhoto}>Hủy</Button>
              </>
            ) : (
              <Upload
                maxCount={1}
                showUploadList={false}
                customRequest={handleUploadRequest}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            )}
          </div>
        </div>

        <div className={styles.formFields}>
          <Form.Item name="email" label="Email">
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>

          <Form.Item
            name="displayName"
            label="Tên hiển thị"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên hiển thị" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>
        </div>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
});

UpdateInfo.displayName = "UpdateInfo";

export default UpdateInfo;
