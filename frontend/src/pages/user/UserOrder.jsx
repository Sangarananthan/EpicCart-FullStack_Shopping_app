import React from "react";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
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

const UserOrder = () => {
  const { data: order, isLoading, error } = useGetMyOrdersQuery();
  const orders = order?.data;
  const StatusBadge = ({ status }) => (
    <Badge variant={status ? "success" : "destructive"} className="w-24">
      {status ? "Completed" : "Pending"}
    </Badge>
  );

  // Mobile card view for each order
  const OrderCard = ({ order }) => (
    <Card className="mb-4 lg:hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={order.orderItems[0].imageUrl}
            alt={order.user}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <p className="text-sm text-gray-500 mb-1">Order ID:</p>
            <p className="font-medium mb-2">{order._id}</p>
            <p className="text-sm text-gray-500 mb-1">Date:</p>
            <p>{order.createdAt.substring(0, 10)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
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

        <Link to={`/order/${order._id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.error || error.error}</Message>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {/* Mobile View */}
      <div className="lg:hidden">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>ID</TableHead>
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
                    alt={order.user}
                    className="w-24 h-24 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                <TableCell>${order.totalPrice}</TableCell>
                <TableCell>
                  <StatusBadge status={order.isPaid} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.isDelivered} />
                </TableCell>
                <TableCell>
                  <Link to={`/order/${order._id}`}>
                    <Button variant="secondary">View Details</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserOrder;
