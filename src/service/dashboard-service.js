import axios from "../utils/axios-customize";

const getDashboardData = () => {
  const API_URL = `/api/v1/database/dashboard`;
  return axios.get(API_URL);
};

export { getDashboardData };
