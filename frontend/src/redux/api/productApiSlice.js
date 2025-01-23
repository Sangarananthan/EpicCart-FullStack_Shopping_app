import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL, UPLOADS_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  //  FETCH PRODUCTS
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCTS_URL}`,
        params: { keyword },
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    // FETCH PRODUCT BY ID
    getProductById: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      providesTags: (result, error, productId) => [
        {
          type: "Product",
          id: productId,
        },
      ],
    }),

    // FETCH ALL PRODUCTS
    getAllProducts: builder.query({
      query: () => `${PRODUCTS_URL}/allproducts`,
      providesTags: ["Product"],
    }),

    getProductDetail: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      keepUnusedDataFor: 5,
    }),

    //CREATE PRODUCT
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}`,
        method: "PUT",
        body: data.form,
        credentials: "include",
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCTS_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTS_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),

    getSimilarProducts: builder.query({
      query: (id) => `${PRODUCTS_URL}/similar/${id}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useGetFilteredProductsQuery,
  useGetSimilarProductsQuery,
} = productApiSlice;
