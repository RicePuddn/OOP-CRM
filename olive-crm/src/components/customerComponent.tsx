"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProductPurchaseHistoryDTO {
  purchaseCounts: number[];
  purchaseDates: string[];
}

interface TopProductDTO {
  productName: string;
  totalQuantity: number;
}

export default function CustomerTopProducts() {
  const [customerId, setCustomerId] = useState("");
  const [topProducts, setTopProducts] = useState<TopProductDTO[]>([]);
  const [purchaseHistory, setPurchaseHistory] =
    useState<ProductPurchaseHistoryDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    try {
      setError(null);
      const topProductsResponse = await axios.get(
        `http://localhost:8080/api/orders/customer/${customerId}/top-products`
      );
      const purchaseHistoryResponse = await axios.get(
        `http://localhost:8080/api/orders/customer/${customerId}/purchase-history`
      );

      console.log("Purchase History Response:", purchaseHistoryResponse.data);

      if (
        purchaseHistoryResponse.data &&
        purchaseHistoryResponse.data.purchaseCounts.length > 0
      ) {
        setTopProducts(topProductsResponse.data);
        setPurchaseHistory(purchaseHistoryResponse.data);
      } else {
        setError("No purchase history found for this customer.");
        setPurchaseHistory(null);
      }
    } catch (e) {
      setError(
        "Failed to fetch data. Please ensure the customer ID is correct."
      );
    }
  };

  const chartData =
    purchaseHistory?.purchaseDates.map((date, index) => ({
      date,
      quantity: purchaseHistory.purchaseCounts[index],
    })) || [];

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
    >
      <div className="p-8 w-full  overflow-auto">
        <div className="p-8 mb-8 border rounded-lg shadow w-full bg-white">
          <h2 className="text-xl font-bold mb-2">Customer Purchase Insights</h2>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="flex-grow"
            />
            <Button
              className="bg-green-700 text-white hover:bg-green-600 hover:text-white"
              onClick={handleFetchData}
            >
              Fetch Data
            </Button>
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {topProducts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-4">Top 3 Products:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topProducts.map((product, index) => (
                  <Card
                    key={index}
                    className="p-4 border rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                  >
                    <CardTitle>{product.productName}</CardTitle>
                    <CardDescription>
                      Total Purchased: {product.totalQuantity}
                    </CardDescription>
                    <CardContent>
                      <Image
                        src={"/images/oil.jpg"}
                        height="500"
                        width="500"
                        alt={"Oil"}
                      ></Image>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {purchaseHistory && (
          <div className="p-8 border rounded-lg shadow w-full bg-white">
            <h3 className="text-lg font-semibold mb-4">
              Purchase History Graph
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{
                    value: "Sales Date",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Quantity Purchased",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quantity" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.section>
  );
}
