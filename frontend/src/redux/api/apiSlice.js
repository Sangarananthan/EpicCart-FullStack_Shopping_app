import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USERs_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Add this
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    // If you have authentication, you can add the token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "Category", "User"],
  endpoints: () => ({}),
});
