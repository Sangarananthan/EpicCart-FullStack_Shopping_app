import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaPlus, FaPencilAlt, FaTrash, FaTimes } from "react-icons/fa";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
} from "../../redux/api/categoryApiSlice";

const CategoryForm = ({
  formData,
  onSubmit,
  onInputChange,
  buttonText = "Create",
  onDelete = null,
}) => (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-lg"
    onSubmit={onSubmit}
  >
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Category Name
      </label>
      <input
        type="text"
        name="name"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Enter category name"
        value={formData.name}
        onChange={onInputChange}
      />
    </div>

    <div className="flex justify-between items-center">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        type="submit"
      >
        <FaPlus className="text-sm" />
        <span>{buttonText}</span>
      </motion.button>

      {onDelete && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onDelete}
          className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
        >
          <FaTrash className="text-sm" />
          <span>Delete</span>
        </motion.button>
      )}
    </div>
  </motion.form>
);

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const EnhancedCategoryList = () => {
  const [formData, setFormData] = useState({
    name: "",
    updatingName: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: categories,
    refetch,
    error,
    isLoading,
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const result = await createCategory({ name: formData.name }).unwrap();
      toast.success("Category created successfully");
      setFormData((prev) => ({ ...prev, name: "" }));
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({
        id: selectedCategory._id,
        name: formData.updatingName,
      }).unwrap();
      toast.success("Category updated successfully");
      setModalVisible(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success("Category deleted successfully");
      setModalVisible(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  {
    const listOfCategories = categories?.map(
      (category) => `${category.name} : ${category._id}`
    );
    console.log(listOfCategories);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:ml-20 mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Categories
        </h1>

        <div className="grid gap-8 md:grid-cols-[2fr,3fr]">
          <div>
            <CategoryForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleCreateCategory}
            />
          </div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Current Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories?.map((category, index) => (
                <motion.button
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group bg-white border-2 border-indigo-100 text-indigo-600 py-3 px-4 rounded-lg hover:border-indigo-500 transition-all"
                  onClick={() => {
                    setSelectedCategory(category);
                    setFormData((prev) => ({
                      ...prev,
                      updatingName: category.name,
                    }));
                    setModalVisible(true);
                  }}
                >
                  <span className="font-medium">{category.name}</span>
                  <motion.span
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaPencilAlt className="text-indigo-500" size={12} />
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Category
          </h2>
          <CategoryForm
            formData={{ name: formData.updatingName }}
            onInputChange={(e) =>
              handleInputChange({
                target: { name: "updatingName", value: e.target.value },
              })
            }
            onSubmit={handleUpdateCategory}
            buttonText="Update"
            onDelete={handleDeleteCategory}
          />
        </Modal>
      </motion.div>
    </div>
  );
};

export default EnhancedCategoryList;
