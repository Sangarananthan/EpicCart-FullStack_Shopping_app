import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// CREATE A PRODUCT
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;

  if (!name || !brand || !description || !price || !category || !quantity) {
    return res.status(400).json({
      message:
        "Please provide all required fields: name, brand, description, price, category, and quantity",
    });
  }

  const product = new Product({ ...req.fields });
  await product.save();

  res.status(201).json({
    product,
    message: "Product created successfully",
  });
});

// UPDATE PRODUCT
const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;

  // if (!name || !brand || !description || !price || !category || !quantity) {
  //   return res.status(400).json({
  //     message:
  //       "Please provide all required fields: name, brand, description, price, category, and quantity",
  //   });
  // }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.fields },
    { new: true }
  );

  res.status(200).json({
    product: updatedProduct,
    message: "Product updated successfully",
  });
});

// DELETE A PRODUCT
const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Product deleted successfully" });
});

// FETCH PRODUCTS
const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword }).limit(pageSize);

  res.status(200).json({
    products,
    page: 1,
    pages: Math.ceil(count / pageSize),
    hasMore: false,
    message: "Products retrieved successfully",
  });
});

// FETCH PRODUCT BY ID
const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

// FETCH ALL PRODUCTS
const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .limit(25)
    .sort({ createAt: -1 });

  res.status(200).json(products);
});

// ADD PRODUCT REVIEW
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res
      .status(400)
      .json({ message: "You have already reviewed this product" });
  }

  if (!rating || !comment) {
    return res
      .status(400)
      .json({ message: "Please provide both rating and comment" });
  }

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added successfully" });
});

// FETCH TOP PRODUCTS
const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);

  res.status(200).json({
    products,
    message: "Top rated products retrieved successfully",
  });
});

// FETCH NEW PRODUCTS
const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(10);

  res.status(200).json({
    products,
    message: "New products retrieved successfully",
  });
});

// FILTER PRODUCTS
const filterProducts = asyncHandler(async (req, res) => {
  const { checked, radio } = req.body;

  if (!checked || !radio) {
    return res.status(400).json({ message: "Please provide filter criteria" });
  }

  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args);

  res.status(200).json({
    products,
    message: "Filtered products retrieved successfully",
  });
});

//  FETCH SIMILAR CATEGORY PRODUCTS
const fetchSimilarCategoryProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.id });
  res.status(200).json({
    products,
    message: "Similar category products retrieved successfully",
  });
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  fetchSimilarCategoryProducts,
};
