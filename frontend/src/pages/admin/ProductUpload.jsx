import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/api/ImageApiSlice";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { CrossIcon, XIcon } from "lucide-react";
const ProductCreateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: null,
    price: "",
    description: "",
    quantity: "",
    brand: "",
    stock: "",
    category: "",
  });
  const [uploadImage, { isLoading: imageLoading }] = useUploadImageMutation();
  const [createProduct] = useCreateProductMutation();
  const {
    data: categories,
    refetch,
    isLoading,
    isError,
  } = useGetCategoriesQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("image", file);
      try {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("imageUrl", formData.imageUrl);
    formdata.append("brand", formData.brand);
    formdata.append("quantity", formData.quantity);
    formdata.append("category", formData.category);
    formdata.append("description", formData.description);
    formdata.append("price", formData.price);
    formdata.append("countInStock", formData.stock);
    try {
      const response = await createProduct(formdata).unwrap();
      toast.success(response.message);
      //   navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Create New Product
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="stock"
                  value={formData.stock}
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || imageLoading}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Creating...
                </span>
              ) : (
                "Create Product"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCreateForm;
