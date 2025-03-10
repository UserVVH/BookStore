import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllOrder } from "../../service/order-service";

const initialState = {
  data: [],
  currentPage: 1,
  pageSize: 5,
  totalData: 0,
  querySearch: null,
  sortField: `-updatedAt`,
  loading: false,
};

// Thunk để gọi API getAllOrder
export const fetchAllOrders = createAsyncThunk(
  "ManageOrderAdmin/fetchAllOrders",
  async ({ currentPage, pageSize, querySearch, sortField }, { dispatch }) => {
    dispatch(setLoading(true));
    const res = await getAllOrder(
      currentPage,
      pageSize,
      querySearch,
      sortField
    );
    if (res.data) {
      const formattedData = res.data.result.map((item) => ({
        ...item,
        totalPrice: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.totalPrice),
      }));
      dispatch(setData(formattedData));
      dispatch(setTotalData(res.data.meta.total));
    }
    dispatch(setLoading(false));
  }
);

const orderAdminSlice = createSlice({
  name: "orderAdmin",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setTotalData: (state, action) => {
      state.totalData = action.payload;
    },
    setQuerySearch: (state, action) => {
      state.querySearch = action.payload;
    },
    setSortField: (state, action) => {
      state.sortField = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setData,
  setCurrentPage,
  setPageSize,
  setTotalData,
  setQuerySearch,
  setSortField,
  setLoading,
} = orderAdminSlice.actions;

export default orderAdminSlice.reducer;
