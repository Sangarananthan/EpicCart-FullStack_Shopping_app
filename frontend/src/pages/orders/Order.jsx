import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ScrollArea } from "../../components/ui/scroll-area";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  // Get order ID from URL parameters
  const { id: orderId } = useParams();

  // Redux queries and mutations
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const orderData = order?.data;

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // Get user info from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // PayPal hooks
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  // Load PayPal script
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId && !window.paypal) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (orderData && !orderData.isPaid) {
        loadPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, orderData, paypal, paypalDispatch]);

  // PayPal handlers
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: orderData.totalPrice } }],
      })
      .then((orderID) => orderID);
  };

  const onError = (err) => {
    toast.error(err.message);
  };

  // Delivery handler for admin
  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // Loading and error states
  if (isLoading) return <Loader />;
  if (error || !orderData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error?.data?.message || "Failed to load order details"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {orderData.orderItems.length === 0 ? (
                <Alert>
                  <AlertDescription>Order is empty</AlertDescription>
                </Alert>
              ) : (
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
                      {orderData.orderItems.map((item, index) => (
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
                              className="hover:underline"
                            >
                              {item.name}
                            </a>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.qty * item.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">{orderData._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{orderData.user.username}</p>
                <p className="text-sm">{orderData.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Shipping Address
                </p>
                <p className="font-medium">
                  {orderData.shippingAddress.address},{" "}
                  {orderData.shippingAddress.city}
                  <br />
                  {orderData.shippingAddress.postalCode},{" "}
                  {orderData.shippingAddress.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant={orderData.isPaid ? "success" : "destructive"}>
                  {orderData.isPaid
                    ? `Paid on ${orderData.paidAt}`
                    : "Not Paid"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Status</p>
                <Badge
                  variant={orderData.isDelivered ? "success" : "secondary"}
                >
                  {orderData.isDelivered
                    ? `Delivered on ${orderData.deliveredAt}`
                    : "Not Delivered"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">${orderData.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${orderData.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${orderData.taxPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">${orderData.totalPrice}</span>
              </div>

              {!orderData.isPaid && (
                <div className="space-y-4">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              )}

              {loadingDeliver && <Loader />}
              {userInfo?.isAdmin &&
                orderData.isPaid &&
                !orderData.isDelivered && (
                  <Button
                    className="w-full"
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                  >
                    Mark As Delivered
                  </Button>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
