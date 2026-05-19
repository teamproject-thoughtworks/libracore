import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { bookApi } from "../services/bookApi";
import { borrowApi } from "../services/borrowApi";
import { notificationsApi } from "../services/notificationsApi";
import { queueApi } from "../services/queueApi";
import { registerApi } from "../services/signupApi";
import { loginApi } from "../services/loginApi";
import { dashboardApi } from "../services/dashboardApi";

const dashboardInvalidationMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (
    action.type?.endsWith("/executeMutation/fulfilled") &&
    (action.type?.startsWith("bookApi/") || 
     action.type?.startsWith("borrowApi/") ||
     action.type?.startsWith("registerApi/"))
  ) {
    store.dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
  }
  
  return result;
};

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
      dashboardApi.middleware,
      dashboardInvalidationMiddleware
    ),
});
