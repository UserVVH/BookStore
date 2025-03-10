import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/accountSlice";
import userReducer from "./user/userSlice";
import bookReducer from "./book/bookSlice";
import searchReducer from "./search/searchSlice";
import orderReducer from "./order/orderSlice";
import orderAdminReducer from "./ManageOrderAdmin/orderAdminSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["user", "book", "search", "account", "orderAdmin"], // không lưu trữ các slice này trong local storage
};

const rootReducer = combineReducers({
  account: accountReducer,
  user: userReducer,
  book: bookReducer,
  search: searchReducer,
  order: orderReducer,
  orderAdmin: orderAdminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
// const store = configureStore({
//   reducer: {
//     account: accountReducer,
//     user: userReducer,
//     book: bookReducer,
//     search: searchReducer,
//   },
// });

export { store, persistor };
