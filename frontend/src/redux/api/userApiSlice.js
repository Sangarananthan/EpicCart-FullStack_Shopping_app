import { apiSlice } from "./apiSlice";
import { USERs_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERs_URL}auth/`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERs_URL}logout/`,
        method: "POST",
      }),
    }),
    register : builder.mutation({
      query: (user) => ({
        url: `${USERs_URL}`,
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation , useLogoutMutation ,useRegisterMutation} = userApiSlice;
