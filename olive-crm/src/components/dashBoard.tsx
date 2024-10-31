"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Users, ShoppingCart, BarChart } from "lucide-react";
import Image from "next/image";

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
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
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

  const chartData = orders.map((order) => ({
    date: format(parseISO(order.salesDate), "yyyy-MM-dd"),
    quantity: order.quantity,
  }));

  return (
    <div className="p-8 w-full">
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <Card className=" transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-blue-800">
              Total Customers
            </CardTitle>
            <Users className="h-7 w-7 text-blue-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-blue-800">
              {totalCustomers}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-green-800">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-7 w-7 text-green-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-green-800">
              {totalOrders}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold  text-yellow-800">
              Average Order Value
            </CardTitle>
            <BarChart className="h-7 w-7  text-yellow-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold  text-yellow-800">
              ${averageOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold  text-purple-800">
              Total Revenue
            </CardTitle>
            <BarChart className="h-7 w-7  text-purple-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold  text-purple-800">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-8 w-full border rounded-lg shadow mt-8">
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
      <Card className="p-8 w-full border rounded-lg shadow mt-8">
        <CardTitle className="text-lg font-semibold mb-4">
          Top 3 Most Purchased Products
        </CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topProducts.map((product, index) => (
              <Card
                key={index}
                className="p-4 border rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
              >
                <CardTitle>{product.productName}</CardTitle>
                <CardDescription>
                  Variant: {product.productVariant}ml
                  <br />
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
        </CardContent>
      </Card>
    </div>
  );
}
