import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import ProgressSteps from "../../components/ProgressSteps.jsx";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
      toast.success("Order placed successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Error placing order");
    }
  };

  if (cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
        <Alert>
          <AlertDescription>
            Your cart is empty.{" "}
            <a href="/products" className="text-primary hover:underline">
              Continue Shopping
            </a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container  mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <ProgressSteps step1 step2 step3 />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Order Items Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.cartItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <a
                            href={`/product/${item.product}`}
                            className="hover:underline text-primary"
                          >
                            {item.name}
                          </a>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.qty * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${cart.taxPrice}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${cart.totalPrice}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Shipping Address</h3>
                <p className="text-sm">
                  {cart.shippingAddress.address},<br />
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},
                  <br />
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Payment Method</h3>
                <p className="text-sm">{cart.paymentMethod}</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.data.message}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={placeOrderHandler}
                disabled={isLoading || cart.cartItems.length === 0}
              >
                {isLoading ? <Loader /> : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
