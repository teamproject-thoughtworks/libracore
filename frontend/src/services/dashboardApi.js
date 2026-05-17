import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3600/dashboard",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/stats",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
