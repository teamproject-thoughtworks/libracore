import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApi = createApi({
  reducerPath: "bookApi",
  
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3600/book",
  }),
  endpoints: (builder) => ({
    
    addbook: builder.mutation({
      query: (bookdetails) => ({
        url: "/addbook",
        method: "POST",
        body: bookdetails,
      }),
    }),
    getAllBooks: builder.query({
      query: () => "/",
    }),

    deleteBook: builder.mutation({
      query: (name) => ({
        url: `/${name}`,
        method: "DELETE",
      }),
    }),
    updateBook: builder.mutation({
      query: ({id,formData}) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

  }),
});
export const {
  useAddbookMutation,
  useGetAllBooksQuery,
  useLazyGetAllBooksQuery,
  useDeleteBookMutation,
  useUpdateBookMutation,
} = bookApi;