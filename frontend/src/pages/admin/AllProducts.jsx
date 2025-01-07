import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetAllProductsQuery } from "../../redux/api/productApiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Pencil, Loader2 } from "lucide-react";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading products
      </div>
    );
  }

  return (
    <div className=" mx-auto  p-6 mt-[3rem]">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">
            All Products ({products.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/admin/product/update/${product._id}`}>
                  <div className="relative h-48">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                      <Pencil className="w-4 h-4 text-pink-600" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-pink-600 font-bold whitespace-nowrap">
                        ${product.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {product.description}
                    </p>

                    <span className="text-xs text-gray-500">
                      {moment(product.createdAt).format("MMM D, YYYY")}
                    </span>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
