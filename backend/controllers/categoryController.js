import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await new Category({ name }).save();
  res.status(201).json({
    category,
    message: "Category created successfully",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Check if new name already exists for another category
  const existingCategory = await Category.findOne({
    name,
    _id: { $ne: categoryId },
  });
  if (existingCategory) {
    return res.status(400).json({ message: "Category name already exists" });
  }

  category.name = name;
  const updatedCategory = await category.save();

  res.status(200).json({
    category: updatedCategory,
    message: "Category updated successfully",
  });
});

const removeCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await Category.deleteOne({ _id: categoryId });
  res.status(200).json({
    message: "Category deleted successfully",
  });
});

const listCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    categories,
    message: "Categories retrieved successfully",
  });
});

const readCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.status(200).json({
    category,
    message: "Category retrieved successfully",
  });
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
