import { Link, useParams } from "react-router-dom";
import { Store, ArrowRight } from "lucide-react";
import ProductDetails from "./pages/products/Product";
import { Alert, AlertDescription } from "./components/ui/alert.jsx";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import Header from "./components/Header";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  // Skeleton loading state for products
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {!keyword && <Header />}
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-700 animate-pulse rounded" />
          <div className="h-10 w-24 bg-gray-700 animate-pulse rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-gray-700 animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-700 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        {!keyword && <Header />}
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            {isError?.data?.message || isError.error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:ml-20">
      {!keyword && <Header />}

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Special Products
            </h1>
            <p className="text-gray-400">
              Discover our carefully curated collection
            </p>
          </div>

          <Button asChild size="lg">
            <Link to="/shop" className="group">
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {data.products.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Store className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Products Found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <div
                key={product._id}
                className="transform transition-all duration-300 hover:translate-y-[-4px]"
              >
                <ProductDetails product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
