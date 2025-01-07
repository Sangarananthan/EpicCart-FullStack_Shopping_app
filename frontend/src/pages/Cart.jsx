import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 mt-[3rem] md:px-[2rem]">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/shop">
            <Button>
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <Card>
            <CardContent className="p-6">
              {cartItems.map((item) => (
                <div key={item._id}>
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-lg font-medium hover:text-pink-500 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.brand}
                      </div>
                      <div className="text-lg font-bold mt-1">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="w-24">
                      <Select
                        value={item.qty.toString()}
                        onValueChange={(value) =>
                          addToCartHandler(item, Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <SelectItem key={x + 1} value={(x + 1).toString()}>
                              {x + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <Separator className="my-6" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items</span>
                  <span>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
