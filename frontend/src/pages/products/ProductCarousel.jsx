import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import {
  Store,
  Clock,
  Star,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Skeleton className="w-full aspect-square rounded-xl" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error?.data?.message || error.error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="relative  aspect-square"
    >
      <h1 className="text-2xl  font-bold tracking-tight mb-[1rem]">
        Top Products
      </h1>
      <CarouselContent>
        {products.products.map((product) => (
          <CarouselItem key={product._id} className="relative">
            {/* Background Image */}
            <div className="relative w-full aspect-square">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain rounded-xl"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent rounded-xl" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-2xl font-bold text-white">
                      {product.name}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="text-lg font-bold bg-white/90 text-black backdrop-blur-sm"
                    >
                      ${product.price}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-200 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-200">
                        <Store className="w-4 h-4 mr-2" />
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{moment(product.createdAt).fromNow()}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                        <span>
                          {product.rating.toFixed(1)} ({product.numReviews}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-200">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        <span>Quantity: {product.quantity}</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <Package className="w-4 h-4 mr-2" />
                        <span>In Stock: {product.countInStock}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/product/${product._id}`}>
                    <Button className="w-full mt-[1rem] bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30">
                      View Product Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden md:flex left-4" />
      <CarouselNext className="hidden md:flex right-4" />
    </Carousel>
  );
};

export default ProductCarousel;
