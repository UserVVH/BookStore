import axios from "../utils/axios-customize";

// Lấy tất cả sách
const getAllBook = (current, pageSize, queryString = "", sortField = null) => {
  let API_URL = `/api/v1/book?current=${current}&pageSize=${pageSize}`;
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

const createBook = (
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  const API_URL = "/api/v1/book";
  const data = {
    thumbnail: thumbnail,
    slider: slider,
    mainText: mainText,
    author: author,
    price: price,
    sold: sold,
    quantity: quantity,
    category: category,
  };
  return axios.post(API_URL, data);
};

const updateBook = (
  id,
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  const API_URL = `/api/v1/book/${id}`;
  const data = {
    thumbnail: thumbnail,
    slider: slider,
    mainText: mainText,
    author: author,
    price: price,
    sold: sold,
    quantity: quantity,
    category: category,
  };
  return axios.put(API_URL, data);
};

const deleteBook = (id) => {
  const API_URL = `/api/v1/book/${id}`;
  return axios.delete(API_URL);
};

const getCategory = () => {
  const API_URL = `/api/v1/database/category`;
  return axios.get(API_URL);
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

// Lọc sách theo các tiêu chí cho trang chủ
const getFilteredBooks = (
  current,
  pageSize,
  { categories = [], minPrice, maxPrice, sortField = null, mainText = null }
) => {
  let API_URL = `/api/v1/book?current=${current}&pageSize=${pageSize}`;

  // Add categories if provided
  if (categories.length > 0) {
    API_URL += `&category=${categories.join(",")}`;
  }

  // Add price range filters if provided
  if (minPrice !== undefined) {
    API_URL += `&price>=${minPrice}`;
  }
  if (maxPrice !== undefined) {
    API_URL += `&price<=${maxPrice}`;
  }

  // Add sort field if provided
  if (sortField) {
    API_URL += `&sort=${sortField}`;
  }

  // Add search term if provided
  if (mainText) {
    API_URL += `&mainText=/${mainText}/i`;
  }

  return axios.get(API_URL);
};

export {
  getAllBook,
  createBook,
  updateBook,
  deleteBook,
  getCategory,
  handleUploadFile,
  getFilteredBooks,
};
