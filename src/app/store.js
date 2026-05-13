import {registerApi} from "../services/signupApi"
import { loginApi } from "../services/loginApi";
import { bookApi } from "../services/bookApi";
import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: {
    [registerApi.reducerPath]: registerApi.reducer,
    [loginApi.reducerPath]:loginApi.reducer,
    [bookApi.reducerPath]:bookApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        registerApi.middleware,
        loginApi.middleware,
        bookApi.middleware
    ),
});