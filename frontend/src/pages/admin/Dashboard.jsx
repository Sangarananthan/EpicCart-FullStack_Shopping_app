import React, { useState, useEffect } from "react";
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
import { ScrollArea } from "../../components/ui/scroll-area";
import { Loader2, DollarSign, Users, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGetOrdersQuery,
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useGetAllUSerQuery } from "../../redux/api/userApiSlice";

const AdminDashboard = () => {
  // API Queries
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetAllUSerQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const StatCard = ({ title, value, isLoading, icon: Icon }) => (
    <Card className="flex-1 min-w-[240px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : title === "Total Sales" ? (
            `$${value?.toFixed(2)}`
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );

  const OrderList = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data?.slice(0, 10).map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    #{order._id.slice(-6)}
                  </TableCell>
                  <TableCell>{order.user?.username || "Anonymous"}</TableCell>
                  <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                      ${
                        order.isPaid
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                      } ring-1 ring-inset`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50  mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <div className="container mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Sales"
            value={sales?.data.totalSales}
            isLoading={salesLoading}
            icon={DollarSign}
          />
          <StatCard
            title="Total Customers"
            value={customers?.length}
            isLoading={customersLoading}
            icon={Users}
          />
          <StatCard
            title="Total Orders"
            value={orders?.data?.length}
            isLoading={ordersLoading}
            icon={ShoppingCart}
          />
        </div>

        {/* Sales Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesDetail?.data.map((item) => ({
                    date: item._id,
                    sales: item.totalSales,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#ec4899"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <OrderList />
      </div>
    </div>
  );
};

export default AdminDashboard;
