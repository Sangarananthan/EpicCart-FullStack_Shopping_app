import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USERs_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Add this
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    // Get token from cookie - the browser will automatically send it
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "Category", "User"],
  endpoints: () => ({}),
});
