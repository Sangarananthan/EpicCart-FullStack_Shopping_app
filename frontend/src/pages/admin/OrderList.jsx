import React from "react";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import AdminMenu from "../../components/AdminMenu";

const OrderList = () => {
  const { data: order, isLoading, error } = useGetOrdersQuery();
  const orders = order?.data;
  const StatusBadge = ({ status }) => (
    <Badge variant={status ? "success" : "destructive"} className="w-24">
      {status ? "Completed" : "Pending"}
    </Badge>
  );

  // Mobile card view for each order
  const OrderCard = ({ order }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={order.orderItems[0].imageUrl}
            alt={order._id}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Order ID:</p>
            <p className="font-medium mb-1 text-sm truncate">{order._id}</p>
            <p className="text-sm text-gray-500">Customer:</p>
            <p className="font-medium">
              {order.user ? order.user.username : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Date:</p>
            <p className="font-medium">
              {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total:</p>
            <p className="font-medium">${order.totalPrice}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment:</p>
            <StatusBadge status={order.isPaid} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery:</p>
            <StatusBadge status={order.isDelivered} />
          </div>
        </div>

        <Link to={`/order/${order._id}`} className="block">
          <Button className="w-full" variant="secondary">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className=" mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <AdminMenu />

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-6">Order Management</h2>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Items</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <img
                      src={order.orderItems[0].imageUrl}
                      alt={order._id}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[150px] truncate">
                    {order._id}
                  </TableCell>
                  <TableCell>
                    {order.user ? order.user.username : "N/A"}
                  </TableCell>
                  <TableCell>
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.isPaid} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.isDelivered} />
                  </TableCell>
                  <TableCell>
                    <Link to={`/order/${order._id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
