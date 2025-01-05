import { apiSlice } from "./apiSlice";
import { UPLOADS_URL } from "../constants";
export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOADS_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = imageApiSlice;
