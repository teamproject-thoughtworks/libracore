import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginApi = createApi({
    reducerPath: "loginApi",

    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3600/" }),

    endpoints: (builder) => ({
        loginuser: builder.mutation({
            query: (user) => ({
                url: "/auth/login",
                method: "POST",
                body: user,
            })
        })
    })
});

export const { useLoginuserMutation } = loginApi;