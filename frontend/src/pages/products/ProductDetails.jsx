import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useCreateReviewMutation,
  useGetProductByIdQuery,
  useGetSimilarProductsQuery,
} from "../../redux/api/productApiSlice";
import {
  Star,
  Store,
  Clock,
  ShoppingCart,
  Box,
  ArrowLeft,
  Tag,
  Truck,
  Shield,
} from "lucide-react";
import moment from "moment";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import HeartIcon from "../../components/HeartIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import Ratings from "../../components/Ratings";
import { useGetCategoryQuery } from "../../redux/api/categoryApiSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductByIdQuery(productId);
  // New query for similar products

  const { data: categoryName, isLoading: loadingCategory } =
    useGetCategoryQuery(product?.category);
  const { data: similarProductData, isLoading: loadingSimilar } =
    useGetSimilarProductsQuery(product?.category);
  const similarProducts = similarProductData?.products;
  const deliveryDate = moment().add(3, "days").format("MMMM Do YYYY");
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>
          {error?.data?.message || error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[3rem]">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </Button>
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[35rem] lg:object-cover object-contain"
                loading="lazy"
              />
              <div className="absolute top-4 right-4">
                <HeartIcon product={product} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-gray-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">${product.price}</span>
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Store className="w-4 h-4 mr-2" />
                <span>Brand: {product.brand}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>Added: {moment(product.createdAt).fromNow()}</span>
              </div>
              <div className="flex items-center text-sm">
                <Box className="w-4 h-4 mr-2" />
                <span>In Stock: {product.countInStock}</span>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-end">
                <Select
                  value={qty.toString()}
                  onValueChange={(value) => setQty(parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <SelectItem key={x + 1} value={(x + 1).toString()}>
                        {x + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>

          <Tabs defaultValue="reviews" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="write-review">Write a Review</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              {product.reviews?.length === 0 ? (
                <p className="text-gray-500">No reviews yet</p>
              ) : (
                product.reviews?.map((review) => (
                  <Card key={review._id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <strong>{review.name}</strong>
                        <Ratings value={review.rating} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {moment(review.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="write-review">
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <Select
                    value={rating.toString()}
                    onValueChange={(value) => setRating(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Star" : "Stars"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                    className="min-h-[100px]"
                  />

                  <Button
                    type="submit"
                    disabled={loadingProductReview}
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                <Alert>
                  <AlertDescription>
                    Please{" "}
                    <Link to="/login" className="font-medium underline">
                      sign in
                    </Link>{" "}
                    to write a review
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="mt-12 space-y-8">
        {/* Product Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-gray-500">
                  Estimated: {deliveryDate}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold">1 Year Warranty</h3>
                <p className="text-sm text-gray-500">Manufacturer warranty</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Tag className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-semibold">Best Price Guarantee</h3>
                <p className="text-sm text-gray-500">Price match available</p>
              </div>
            </div>
          </Card>
        </section>
        {/* Product Details Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Product Details</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Brand</h4>
                  <p className="text-gray-600">{product.brand}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Category</h4>
                  {loadingCategory ? (
                    <p>Loading...</p>
                  ) : (
                    <p className="text-gray-600">
                      {categoryName.category.name}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">Stock</h4>
                  <p className="text-gray-600">{product.countInStock} units</p>
                </div>
                <div>
                  <h4 className="font-semibold">Added</h4>
                  <p className="text-gray-600">
                    {moment(product.createdAt).format("MMMM Do YYYY")}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Similar Products Section */}
        {similarProducts?.length > 1 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">{`More from ${categoryName?.category.name}`}</h2>
            <Carousel className="w-[90%] md:w-full">
              <CarouselContent>
                {similarProducts
                  .filter((p) => p._id !== product._id)
                  .slice(0, 6)
                  .map((similarProduct) => (
                    <CarouselItem
                      key={similarProduct._id}
                      className="md:basis-1/3 lg:basis-1/4"
                    >
                      <Card className="h-full">
                        <CardContent className="p-4">
                          <Link to={`/product/${similarProduct._id}`}>
                            <img
                              src={similarProduct.imageUrl}
                              alt={similarProduct.name}
                              className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h3 className="font-semibold truncate">
                              {similarProduct.name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold">
                                ${similarProduct.price}
                              </span>
                              <Ratings value={similarProduct.rating} />
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {/* Customer Reviews Summary */}
        {product.reviews?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Review Summary</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold">
                      {product.rating.toFixed(1)}
                    </span>
                    <div>
                      <Ratings value={product.rating} />
                      <p className="text-sm text-gray-500">
                        Based on {product.numReviews} reviews
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  {/* Add a rating distribution bar chart here if you have the data */}
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
