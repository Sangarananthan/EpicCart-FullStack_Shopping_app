import { apiSlice } from "./apiSlice";
import { USERs_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATING AN USER

    register: builder.mutation({
      query: (user) => ({
        url: `${USERs_URL}`,
        method: "POST",
        body: user,
        credentials: "include",
      }),
    }),

    // LOGIN USER

    login: builder.mutation({
      query: (data) => ({
        url: `${USERs_URL}auth/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // LOGOUT USER

    logout: builder.mutation({
      query: () => ({
        url: `${USERs_URL}logout/`,
        method: "POST",
        credentials: "include",
      }),
    }),

    // GET ALL USERS
    getAllUSer: builder.query({
      query: () => ({
        url: `${USERs_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    // GET CURRENT USER

    getCurrentUser: builder.query({
      query: () => ({
        url: `${USERs_URL}profile/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // UPDATE CURRENT USER
    updateCurrentUser: builder.mutation({
      query: (data) => ({
        url: `${USERs_URL}profile/`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // DELETE USER BY ID

    deleteUserById: builder.mutation({
      query: (id) => ({
        url: `${USERs_URL}${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    // UPDATE USER BY ID

    updateUserById: builder.mutation({
      query: (data) => ({
        url: `${USERs_URL}${data.id}/`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // GET USER BY ID

    getUserById: builder.query({
      query: (id) => ({
        url: `${USERs_URL}${id}/`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetAllUSerQuery,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useDeleteUserByIdMutation,
  useUpdateUserByIdMutation,
  useGetUserByIdQuery,
} = userApiSlice;
