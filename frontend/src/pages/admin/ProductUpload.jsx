import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/api/ImageApiSlice";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { Loader, XIcon } from "lucide-react";
const ProductCreateForm = () => {
  const [createloading, setCreateLoading] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  //Initial formdata
  const initialState = {
    name: "",
    imageUrl: null,
    price: "",
    description: "",
    quantity: "",
    brand: "",
    countInStock: "",
    category: "",
  };
  const [formData, setFormData] = useState(initialState);

  //Product Image
  const [image, setImage] = useState(null);
  const [uploadImage, { isLoading: imageLoading }] = useUploadImageMutation();
  //Image upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("image", file);
      try {
        console.log("check");
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
        const response = await uploadImage(formdata);
        if (response.data.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: response.data.imageUrl,
          }));
          toast.success(`${response.data.message}`);
        } else {
          toast.error(`${response.data.message}`);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
      }
    }
  };

  //Fetching Categories
  const { data: categories, refetch } = useGetCategoriesQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);

  //Create Product
  const [createProduct] = useCreateProductMutation();
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    const newForm = new FormData();
    newForm.append("name", formData.name);
    newForm.append("imageUrl", formData.imageUrl);
    newForm.append("brand", formData.brand);
    newForm.append("quantity", formData.quantity);
    newForm.append("category", formData.category);
    newForm.append("description", formData.description);
    newForm.append("price", formData.price);
    newForm.append("countInStock", formData.countInStock);
    try {
      const response = await createProduct(newForm).unwrap();
      navigate("/admin/allproducts");
      toast.success(response.message);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product");
    }
    setCreateLoading(false);
  };

  //fetch Product data - update Route
  const { _id: productId } = useParams();
  const location = useLocation();
  const isUpdate = location.pathname.includes("/product/update/");
  const {
    data: product,
    refetch: productRefetch,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductByIdQuery(productId);
  useEffect(() => {
    if (isUpdate && product) {
      setFormData(product);
      setImage(product.imageUrl);
    }
  }, [isUpdate, product]);

  //Update Product
  const [updateProduct] = useUpdateProductMutation();
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const newForm = new FormData();
    newForm.append("name", formData.name);
    newForm.append("imageUrl", formData.imageUrl);
    newForm.append("brand", formData.brand);
    newForm.append("quantity", formData.quantity);
    newForm.append("category", formData.category);
    newForm.append("description", formData.description);
    newForm.append("price", formData.price);
    newForm.append("countInStock", formData.countInStock);
    try {
      const response = await updateProduct({
        id: productId,
        form: newForm,
      });
      navigate("/admin/allproducts");
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to Update product");
    }
    setUpdateLoading(false);
  };

  //Delete Product
  const [deleteProduct] = useDeleteProductMutation();
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      const response = await deleteProduct(productId).unwrap();
      toast.success(response.message);
      navigate("/admin/allproducts");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to Delete product");
    }
    setDeleteLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen  mx-auto px-4 py-8 md:px-[2rem] bg-gray-50 p-6 mt-[3rem]"
    >
      {isUpdate && productLoading ? (
        <Loader />
      ) : (
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-gray-800 mb-[1rem]"
          >
            {isUpdate ? `Update Product` : `Create New Product`}
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <form className="space-y-6">
              {/* Image Upload Section */}
              <div className="mb-8">
                <motion.div
                  className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Product preview"
                        className="max-h-[200px] mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 h-5 w-5 bg-red-500 text-white p-1rounded-full flex items-center"
                      >
                        <XIcon />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                      <span className="text-gray-500">
                        Click or drag image to upload
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </motion.div>
              </div>

              {/* Main Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Price Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter price"
                  />
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Brand Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                </div>

                {/* Stock Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter stock quantity"
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.01 }}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </motion.select>
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              {isUpdate ? (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="update"
                    onClick={handleUpdate}
                    disabled={updateloading || imageLoading}
                    className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    {updateloading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        {"Updating.."}
                      </span>
                    ) : (
                      "Update"
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    onClick={handleDelete}
                    disabled={deleteloading || imageLoading}
                    className="w-full md:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    {deleteloading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        {"Deleting..."}
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </motion.button>
                </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    onClick={handleCreate}
                    disabled={createloading || imageLoading}
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    {createloading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        {"Creating..."}
                      </span>
                    ) : (
                      "Create"
                    )}
                  </motion.button>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCreateForm;
