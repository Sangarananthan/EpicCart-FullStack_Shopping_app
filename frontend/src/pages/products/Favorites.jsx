import Product from "./Product";
import { HeartOff } from "lucide-react";
import { getFavoritesFromLocalStorage } from "../../utils/localStorage";
import { useEffect } from "react";
import { Link } from "react-router";

const Favorites = () => {
  const favorites = getFavoritesFromLocalStorage();
  useEffect(() => {});
  return (
    <div className=" mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Favorite Products</h1>
        <p className="text-gray-500 mt-2">
          {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <Link to={"/"}>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HeartOff className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 max-w-sm">
              Items you favorite will appear here. Start exploring products to
              add some!
            </p>
          </div>
        </Link>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
