import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const registerApi = createApi({
    reducerPath: "registerApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3600/"
    }),

    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (user) => ({
                url: "/auth/signup",
                method: "POST",
                body: user
            })
        })
    })
})

export const { useRegisterUserMutation } = registerApi;