import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllUser } from "../../service/user-service";

// slice này dùng cho quản lý user trong dashboard admins
const initialState = {
  data: [],
  currentPage: 1,
  pageSize: 5,
  totalData: 0,
  querySearch: null,
  sortField: null,
  loading: false,
};

// Thunk để gọi API getAllUser
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async ({ currentPage, pageSize, querySearch, sortField }, { dispatch }) => {
    dispatch(setLoading(true));
    const res = await getAllUser(currentPage, pageSize, querySearch, sortField);
    if (res.data) {
      dispatch(setData(res.data.result));
      dispatch(setTotalData(res.data.meta.total));
    }
    dispatch(setLoading(false));
  }
);

const userSlice = createSlice({
  name: "user",
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
} = userSlice.actions;

export default userSlice.reducer;
