import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3600/notification",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: ({ userId, page = 1, limit = 20 }) =>
        `/notifications/${userId}?page=${page}&limit=${limit}`,
      providesTags: ["Notifications"],
      transformResponse: (response) => response.data,
    }),
    markRead: builder.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
    markAllRead: builder.mutation({
      query: (userId) => ({ url: `/notifications/${userId}/read-all`, method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useLazyGetNotificationQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} = notificationsApi;