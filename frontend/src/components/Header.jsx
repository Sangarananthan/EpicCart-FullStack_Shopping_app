import Loader from "./Loader";
import SmallProduct from "../pages/products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { useGetNewProductsQuery } from "../redux/api/productApiSlice";

const Header = () => {
  const { data, isLoading, error } = useGetNewProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <h1>ERROR</h1>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Square Carousel */}
        <div className="col-span-1 md:col-span-12 lg:col-span-6 xl:col-span-6">
          <ProductCarousel />
        </div>
        {/* Product Grid - Responsive visibility */}
        <div className="col-span-1 md:col-span-12 lg:col-span-6 xl:col-span-6">
          <div className="flex flex-col h-full justify-between">
            <h1 className="text-3xl font-bold tracking-tight mb-[1rem]">
              New Arrivals
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-2 gap-6 flex-grow">
              {data.products.slice(0, 4).map((product) => (
                <div key={product._id} className="w-full">
                  <SmallProduct product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
