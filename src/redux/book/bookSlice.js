import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllBook } from "../../service/book-service";

const initialState = {
  data: [],
  currentPage: 1,
  pageSize: 5,
  totalData: 0,
  querySearch: null,
  sortField: `-updatedAt`,
  loading: false,
};

// Thunk để gọi API getAllBook
export const fetchAllBooks = createAsyncThunk(
  "book/fetchAllBooks",
  async ({ currentPage, pageSize, querySearch, sortField }, { dispatch }) => {
    dispatch(setLoading(true));
    const res = await getAllBook(currentPage, pageSize, querySearch, sortField);
    if (res.data) {
      const formattedData = res.data.result.map((item) => ({
        ...item,
        price: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.price),
      }));
      dispatch(setData(formattedData));
      dispatch(setTotalData(res.data.meta.total));
    }
    dispatch(setLoading(false));
  }
);

const bookSlice = createSlice({
  name: "book",
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
} = bookSlice.actions;

export default bookSlice.reducer;
