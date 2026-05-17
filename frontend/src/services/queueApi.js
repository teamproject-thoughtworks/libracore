import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3600/queue",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const queueApi = createApi({
  reducerPath: "queueApi",
  baseQuery,
  tagTypes: ["Queue"],
  endpoints: (builder) => ({
    getPosition: builder.query({
      query: ({ userId, bookId }) => `/position/${bookId}/${userId}`,
      providesTags: ["Queue"],
      transformResponse: (response) => response.data,
    }),
    getQueue: builder.query({
      query: (bookId) => `/${bookId}`,
      providesTags: ["Queue"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetPositionQuery,
  useLazyGetPositionQuery,
  useGetQueueQuery,
  useLazyGetQueueQuery,
} = queueApi;