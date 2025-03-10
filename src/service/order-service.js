import axios from "../utils/axios-customize";

const createOrder = (data) => {
  const API_URL = "/api/v1/order";
  return axios.post(API_URL, data);
};

const getOrderHistory = () => {
  const API_URL = "/api/v1/history";
  return axios.get(API_URL);
};

const getAllOrder = (current, pageSize, queryString = "", sortField = null) => {
  let API_URL = `/api/v1/order?current=${current}&pageSize=${pageSize}`;
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

export { createOrder, getOrderHistory, getAllOrder };
