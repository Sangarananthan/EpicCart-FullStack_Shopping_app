import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Heart } from "lucide-react";

const SmallProduct = ({ product }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <Card className="h-full overflow-hidden group">
      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-[4/3]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked ? "fill-pink-500 text-pink-500" : "text-gray-600"
              }`}
            />
          </button>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <CardContent className="p-2.5">
          <div className="flex flex-col items-start justify-between gap-2">
            <h3 className="text-sm font-medium line-clamp-1 group-hover:text-pink-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex flex-row justify-between w-full">
              <div>
                <Badge
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  ${product.price}
                </Badge>
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  In Stock : {product.countInStock}
                </Badge>
              </div>
              
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default SmallProduct;
