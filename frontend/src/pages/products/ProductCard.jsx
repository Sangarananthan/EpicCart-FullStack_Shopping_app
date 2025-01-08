import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import HeartIcon from "../../components/HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...p, qty }));
    navigate("/cart");
  };

  return (
    <Card className="bg-neutral-100 relative h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <Link to={`/product/${p._id}`}>
          <div className="w-full h-64 relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl p-[.3rem]">
              <img
                className="w-full h-full object-cover rounded-lg "
                src={p.imageUrl}
                alt={p.name}
              />
            </div>
            <Badge
              className="absolute bottom-3 right-3 bg-pink-600 hover:bg-pink-700 z-10"
              variant="secondary"
            >
              {p?.brand}
            </Badge>
          </div>
        </Link>

        <div className="absolute bottom-4 left-4">
          <HeartIcon product={p} />
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-black line-clamp-2">
            {p?.name}
          </h3>
          <p className="text-lg font-bold text-pink-500">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <p className="text-zinc-400 line-clamp-2 text-sm">{p?.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
        <Button
          asChild
          variant="default"
          className="bg-pink-600 hover:bg-pink-700 flex-grow"
        >
          <Link to={`/product/${p._id}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0  hover:bg-pink-600/20 hover:text-pink-500"
          onClick={() => addToCartHandler(p, 1)}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
