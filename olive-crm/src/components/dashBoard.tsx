"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Users, ShoppingCart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    pid: number;
  };
  quantity: number;
  totalCost: number;
  orderMethod: string;
  salesDate: string;
  salesType: string;
  shippingMethod: string;
}

interface TopProduct {
  productName: string;
  productVariant: string;
  pid: number;
  totalQuantity: number;
}

export default function AllCustomerPurchaseHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

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
        setTotalOrders(allOrders.length);

        // Calculate total customers
        const uniqueCustomers = new Set(
          allOrders.map((order) => order.customer.cid)
        );
        setTotalCustomers(uniqueCustomers.size);

        // Calculate total revenue
        const revenue = allOrders.reduce(
          (sum, order) => sum + order.totalCost,
          0
        );
        setTotalRevenue(revenue);

        // Calculate average order value
        const avgOrderValue = revenue / allOrders.length;
        setAverageOrderValue(avgOrderValue);

        // Calculate top 3 most purchased products
        const productQuantities = allOrders.reduce((acc, order) => {
          const key = `${order.product.productName}-${order.product.productVariant}-${order.product.pid}`;
          acc[key] = (acc[key] || 0) + order.quantity;
          return acc;
        }, {} as Record<string, number>);
        const topProductsArray = Object.entries(productQuantities)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([key, totalQuantity]) => {
            const [productName, productVariant, pid] = key.split("-");
            return {
              productName,
              productVariant,
              pid: parseInt(pid) || 0,
              totalQuantity,
            };
          });
        setTopProducts(topProductsArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      }
    };
    fetchAllOrders();
  }, []);

  const chartData =
    orders.map((order) => ({
      date: format(parseISO(order.salesDate), "yyyy-MM-dd"),
      quantity: order.quantity,
    })) ?? [];

  const chartProductData = orders
    .filter(
      (order) =>
        !selectedProduct || order.product.productName === selectedProduct
    )
    .map((order) => ({
      date: format(parseISO(order.salesDate), "yyyy-MM-dd"),
      quantity: order.quantity,
    }));

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-SG", {
      style: "currency",
      currency: "SGD",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
    >
      <div className="p-8 w-full">
        <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
        <Card className="p-8 w-full border rounded-lg shadow mt-4">
          <CardTitle className="text-lg font-semibold mb-4">
            At a Glance
          </CardTitle>
          <CardContent>
            {totalCustomers > 0 && totalOrders > 0 && totalRevenue > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                <Card className=" transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-100">
                    <CardTitle className="text-sm font-medium text-blue-800">
                      Total Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-800">
                      {totalCustomers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total customers that have made a purchase
                    </p>
                  </CardContent>
                </Card>
                <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-100">
                    <CardTitle className="text-sm font-medium text-green-800">
                      Total Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-green-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-800">
                      {totalOrders}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All orders made
                    </p>
                  </CardContent>
                </Card>
                <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-100">
                    <CardTitle className="text-sm font-medium text-yellow-800">
                      Average Order Value
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-yellow-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-800">
                      {formatCurrency(averageOrderValue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How much a typical customer spends
                    </p>
                  </CardContent>
                </Card>
                <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-100">
                    <CardTitle className="text-sm font-medium text-purple-800">
                      Total Revenue
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-purple-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-800">
                      {formatCurrency(totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total revenue made from orders
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="p-8 w-full border rounded-lg shadow mt-8">
          <CardTitle className="text-lg font-semibold mb-4">
            All Orders History
          </CardTitle>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <CardContent>
            {chartData.length > 0 && (
              <div
                style={{
                  width: "full",
                  height: "100%",
                  overflowX: "auto",
                  overflowY: "auto",
                }}
              >
                <ChartContainer
                  config={{
                    quantity: {
                      label: "Quantity Purchased",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="aspect-auto h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        label={{
                          value: "Sales Date",
                          position: "insideBottom",
                          offset: 3,
                        }}
                      />
                      <YAxis
                        label={{
                          value: "Quantity Purchased",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <ChartTooltip />
                      <Bar dataKey="quantity" fill="var(--color-quantity)" />
                      <Brush
                        dataKey="date"
                        height={30}
                        stroke="#15803D"
                        startIndex={1}
                        endIndex={100}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="p-8 w-full border rounded-lg shadow mt-8">
          <CardTitle className="text-lg font-semibold mb-4">
            Top 3 Most Purchased Products
          </CardTitle>
          <CardContent>
            {topProducts && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {topProducts.map((product, index) => (
                  <Card
                    key={index}
                    className="p-4 border rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                  >
                    <CardTitle>{product.productName}</CardTitle>
                    <CardDescription>
                      Variant: {product.productVariant}ml <br />
                      Total Purchased: {product.totalQuantity}
                    </CardDescription>
                    <CardContent>
                      <Image
                        src={
                          imageError[product.pid]
                            ? "/images/products/oil.jpg"
                            : `/images/products/${product.pid}.jpg`
                        }
                        height="500"
                        width="500"
                        alt={"Product Image"}
                        onError={() =>
                          setImageError((prev) => ({
                            ...prev,
                            [product.pid]: true,
                          }))
                        }
                      ></Image>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="p-8 w-full border rounded-lg shadow mt-8">
          <CardTitle className="text-lg font-semibold mb-4">
            Product Purchase History
          </CardTitle>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <CardContent>
            <div className="mb-4">
              <Select onValueChange={(value) => setSelectedProduct(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product to view its purchase history" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    new Set(orders.map((order) => order.product.productName))
                  ).map((productName) => (
                    <SelectItem key={productName} value={productName}>
                      {productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProduct && (
              <div
                style={{
                  width: "full",
                  height: "100%",
                  overflowX: "auto",
                  overflowY: "auto",
                }}
              >
                <ChartContainer
                  config={{
                    quantity: {
                      label: "Quantity Purchased",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="aspect-auto h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={selectedProduct ? chartProductData : []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        label={{
                          value: "Sales Date",
                          position: "insideBottom",
                          offset: 3,
                        }}
                      />
                      <YAxis
                        label={{
                          value: "Quantity Purchased",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <ChartTooltip />
                      <Bar dataKey="quantity" fill="var(--color-quantity)" />
                      <Brush dataKey="date" height={30} stroke="#15803D" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
