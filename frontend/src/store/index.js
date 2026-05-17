import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { bookApi } from "../services/bookApi";
import { borrowApi } from "../services/borrowApi";
import { notificationsApi } from "../services/notificationsApi";
import { queueApi } from "../services/queueApi";
import { registerApi } from "../services/signupApi";
import { loginApi } from "../services/loginApi";
import { dashboardApi } from "../services/dashboardApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [borrowApi.reducerPath]: borrowApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [queueApi.reducerPath]: queueApi.reducer,
    [registerApi.reducerPath]: registerApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookApi.middleware,
      borrowApi.middleware,
      notificationsApi.middleware,
      queueApi.middleware,
      registerApi.middleware,
      loginApi.middleware,
      dashboardApi.middleware
    ),
});
