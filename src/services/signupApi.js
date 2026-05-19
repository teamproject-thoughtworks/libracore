import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3600/",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const registerApi = createApi({
  reducerPath: "registerApi",
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({ url: "/auth/signup", method: "POST", body: user }),
      transformResponse: (response) => response.data,
    }),
    getUsersById: builder.query({
      query: (id) => `/auth/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useRegisterUserMutation, useGetUsersByIdQuery } = registerApi;