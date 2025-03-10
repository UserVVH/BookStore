import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: "",
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isAuthenticated = true;
      state.isLoading = false;
      //lấy payload truyền từ  bên ngoài sau đó gán vào state của redux
      state.user = action.payload;
    },
    doGetAccountAction: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isAuthenticated = true;
      state.isLoading = false;
      //lấy payload sau đó gán vào state của redux
      state.user = action.payload;
    },
    doLogoutAccountAction: (state, action) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
      };
    },
    updateUserInfo: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload, // Cập nhật thông tin mới vào state.user
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  doLoginAction,
  doGetAccountAction,
  doLogoutAccountAction,
  updateUserInfo,
} = accountSlice.actions;

export default accountSlice.reducer;
