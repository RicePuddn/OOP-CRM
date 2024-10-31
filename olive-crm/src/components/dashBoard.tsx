"use client";
import { Users, ShoppingCart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { format, parseISO } from "date-fns";

interface Order {
  id: number;
  customer: {
    zipcode: string;
    cid: number;
  };
  product: {
    productName: string;
    productVariant: string;
    individualPrice: number;
    productId: number;
  };
  quantity: number;
  totalCost: number;
  orderMethod: string;
  salesDate: string;
  salesType: string;
  shippingMethod: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        let allOrders: Order[] = [];
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
          const response = await axios.get(
            `http://localhost:8080/api/orders?page=${currentPage}&size=20`
          );
          allOrders = allOrders.concat(response.data.content);
          totalPages = response.data.totalPages;
          currentPage++;
        }

        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      }
    };
    fetchAllOrders();
  }, []);

  const chartData = orders.map((order) => ({
    date: format(parseISO(order.salesDate), "yyyy-MM-dd"),
    quantity: order.quantity,
  }));
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
    >
      <div className="w-full px-6 py-8">
        <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
        <Card className="p-8 w-full border rounded-lg shadow">
          <CardTitle className="text-lg font-semibold mb-4">
            All Customer Purchase History
          </CardTitle>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <CardContent>
            <div style={{ width: "100%", height: 500, overflowX: "auto" }}>
              <Plot
                data={[
                  {
                    x: chartData.map((data) => data.date),
                    y: chartData.map((data) => data.quantity),
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "#8884d8" },
                  },
                ]}
                layout={{
                  title: "All Customer Purchase History",
                  xaxis: {
                    title: "Sales Date",
                    tickformat: "%b %Y",
                    automargin: true,
                  },
                  yaxis: {
                    title: "Quantity Purchased",
                    automargin: true,
                  },
                  margin: { t: 50, r: 30, l: 50, b: 50 },
                  autosize: true,
                }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <Card className=" transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,274</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$534.32</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$6,537,234</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <h3 className="mt-6 text-xl text-gray-700">Recent Orders</h3>
        <Card className="mt-4 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">#1234</TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell>Extra Virgin Olive Oil</TableCell>
                <TableCell>$59.99</TableCell>
                <TableCell>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">#1235</TableCell>
                <TableCell>Jane Doe</TableCell>
                <TableCell>Organic Olive Oil</TableCell>
                <TableCell>$45.99</TableCell>
                <TableCell>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">#1236</TableCell>
                <TableCell>Bob Johnson</TableCell>
                <TableCell>Infused Olive Oil Set</TableCell>
                <TableCell>$89.99</TableCell>
                <TableCell>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Processing
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Low Stock Alert */}
        <h3 className="mt-6 text-xl text-gray-700">Low Stock Alert</h3>
        <Card className="mt-4 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Extra Virgin Olive Oil (500ml)
                </TableCell>
                <TableCell>15</TableCell>
                <TableCell>20</TableCell>
                <TableCell>
                  <Button size="sm">Reorder</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Organic Olive Oil (750ml)
                </TableCell>
                <TableCell>8</TableCell>
                <TableCell>15</TableCell>
                <TableCell>
                  <Button size="sm">Reorder</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </motion.section>
  );
}
