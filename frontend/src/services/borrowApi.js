import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3600/borrow",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const borrowApi = createApi({
  reducerPath: "borrowApi",
  baseQuery,
  tagTypes: ["Borrows"],
  endpoints: (builder) => ({
    borrowbook: builder.mutation({
      query: (body) => ({ url: "/borrowbook", method: "POST", body }),
      invalidatesTags: ["Borrows"],
    }),
    returnBook: builder.mutation({
      query: (borrowId) => ({ url: "/return", method: "POST", body: { borrowId } }),
      invalidatesTags: ["Borrows"],
    }),
    getborrowbooks: builder.query({
      query: ({ page = 1, limit = 20, userId = "" } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (userId) params.set("userId", userId);
        return `/getborrowbooks?${params.toString()}`;
      },
      providesTags: ["Borrows"],
      transformResponse: (response) => response.data,
    }),
    getreturnbooks: builder.query({
      query: ({ page = 1, limit = 20, userId = "" } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (userId) params.set("userId", userId);
        return `/getreturnbooks?${params.toString()}`;
      },
      providesTags: ["Borrows"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useBorrowbookMutation,
  useReturnBookMutation,
  useGetborrowbooksQuery,
  useLazyGetborrowbooksQuery,
  useGetreturnbooksQuery,
  useLazyGetreturnbooksQuery,
} = borrowApi;