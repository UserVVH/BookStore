import axios from "../utils/axios-customize";
// const getAllUser = (current, pageSize) => {
//   const API_URL = `/api/v1/user?current=${current}&pageSize=${pageSize}`;

//   return axios.get(API_URL);
// };

const getAllUser = (current, pageSize, queryString = "", sortField = null) => {
  let API_URL = `/api/v1/user?current=${current}&pageSize=${pageSize}`;
  // Thêm query string nếu có
  if (queryString) {
    API_URL += `&${queryString}`;
  }

  // Thêm trường sắp xếp nếu có
  if (sortField) {
    API_URL += `&sort=${sortField}`;
  }

  return axios.get(API_URL);
};

const createUser = (fullName, password, email, phone) => {
  const API_URL = "/api/v1/user";
  const data = {
    fullName: fullName,
    password: password,
    email: email,
    phone: phone,
  };
  return axios.post(API_URL, data);
};

//tạo user từ import file xlsx
const createUserBulk = (users) => {
  const API_URL = "/api/v1/user/bulk-create";
  return axios.post(API_URL, users);
};

const updateUser = (id, fullName, phone, avatar) => {
  const API_URL = "/api/v1/user";
  const data = {
    _id: id,
    fullName: fullName,
    phone: phone,
    ...(avatar && { avatar: avatar }), // Only include avatar if it exists
  };
  return axios.put(API_URL, data);
};

const deleteUser = (id) => {
  const API_URL = `/api/v1/user/${id}`;
  return axios.delete(API_URL);
};

const handleUploadFile = (file, folder) => {
  const API_URL = `/api/v1/file/upload`;
  let config = {
    headers: {
      "upload-type": folder,
      "Content-Type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file);
  return axios.post(API_URL, bodyFormData, config);
};

const changePassword = (data) => {
  const API_URL = `/api/v1/user/change-password`;
  return axios.post(API_URL, data);
};

export {
  getAllUser,
  createUser,
  createUserBulk,
  updateUser,
  deleteUser,
  handleUploadFile,
  changePassword,
};
