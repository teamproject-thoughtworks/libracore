import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3600/book",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery,
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    addbook: builder.mutation({
      query: (bookdetails) => ({ url: "/addbook", method: "POST", body: bookdetails }),
      invalidatesTags: ["Books"],
    }),
    getAllBooks: builder.query({
      query: ({ page = 1, limit = 50, search = "", category = "", status = "" } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set("page", page);
        if (limit) params.set("limit", limit);
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (status) params.set("status", status);
        return `/?${params.toString()}`;
      },
      providesTags: ["Books"],
      transformResponse: (response) => response.data,
    }),
    deleteBook: builder.mutation({
      query: (name) => ({ url: `/${name}`, method: "DELETE" }),
      invalidatesTags: ["Books"],
    }),
    updateBook: builder.mutation({
      query: ({ id, formData }) => ({ url: `/${id}`, method: "PUT", body: formData }),
      invalidatesTags: ["Books"],
    }),
    getBookById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useAddbookMutation,
  useGetAllBooksQuery,
  useLazyGetAllBooksQuery,
  useDeleteBookMutation,
  useUpdateBookMutation,
  useGetBookByIdQuery,
} = bookApi;