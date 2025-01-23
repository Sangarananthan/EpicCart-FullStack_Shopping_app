import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USERs_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers["Content-Type"] = "application/json";

    // Optionally, retrieve the token from cookies or state and set it
    const token = getState().auth.token; // or from cookies directly
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "Category", "User"],
  endpoints: () => ({}),
});
