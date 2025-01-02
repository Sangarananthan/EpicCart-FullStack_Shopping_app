import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "../constants";
export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE A CATEGORY
    createCategory: builder.mutation({
      query: (category) => ({
        url: `${CATEGORIES_URL}`,
        method: "POST",
        body: category,
        credentials: "include",
      }),
    }),
    // UPDATE A CATEGORY
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}${data.id}/`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // DELETE A CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    // GET ALL CATEGORIES
    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORIES_URL}categories/`,
        method: "GET",
        credentials: "include",
      }),
    }),
    // GET A SINGLE CATEGORY
    getCategory: builder.query({
      query: (id) => ({
        url: `${CATEGORIES_URL}${id}/`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
} = categoryApiSlice;
