import { Badge } from "../..//components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router";
import HeartIcon from "../../components/HeartIcon";

const Product = ({ product }) => {
  return (
    <Card className="group h-full overflow-hidden relative">
      <div className="relative aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/20 backdrop-blur-xl hover:bg-red-800/20 transition-colors"
        >
          <HeartIcon product={product} />
        </button>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Link to={`/product/${product._id}`} className="block">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-medium line-clamp-2 group-hover:text-pink-500 transition-colors">
              {product.name}
            </h2>
            <Badge
              variant="secondary"
              className="whitespace-nowrap bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
            >
              ${product.price}
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default Product;
