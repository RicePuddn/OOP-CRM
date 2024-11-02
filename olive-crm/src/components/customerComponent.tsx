"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  BarChart,
  Bar,
  Brush,
} from "recharts";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip } from "./ui/chart";

interface ProductPurchaseHistoryDTO {
  purchaseCounts: number[];
  purchaseDates: string[];
}

interface TopProductDTO {
  productId: number;
  productName: string;
  totalQuantity: number;
}

interface Customer {
  zipcode: string;
  cid: number;
}

export default function CustomerTopProducts() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [topProducts, setTopProducts] = useState<TopProductDTO[]>([]);
  const [customerId, setCustomerId] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [purchaseHistory, setPurchaseHistory] =
    useState<ProductPurchaseHistoryDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // Add a dependency array to avoid infinite loop
  useEffect(() => {
    const fetchCustomerIds = async () => {
      if (customerId.length > 0) return;
      try {
        const response = await axios.get(
          "http://localhost:8080/api/customers/retrieve"
        );
        setCustomerId(response.data);
      } catch (error) {
        console.error("Error fetching customer IDs:", error);
      }
    };
    fetchCustomerIds();
  }, []); // Empty array ensures this runs only once when component mounts

  const handleFetchData = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer first.");
      return;
    }

    try {
      setError(null);
      const topProductsResponse = await axios.get(
        `http://localhost:8080/api/orders/customer/${selectedCustomer.cid}/top-products`
      );
      const purchaseHistoryResponse = await axios.get(
        `http://localhost:8080/api/orders/customer/${selectedCustomer.cid}/purchase-history`
      );

      if (
        purchaseHistoryResponse.data &&
        purchaseHistoryResponse.data.purchaseCounts.length > 0
      ) {
        console.log("Top Products Response:", topProductsResponse.data);
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
      <div className="p-8 w-full overflow-auto">
        <h3 className="text-gray-700 text-3xl font-medium">Customer</h3>
        <div className="p-8 mb-8 border rounded-lg shadow w-full bg-white mt-4">
          <h2 className="text-xl font-bold mb-2">Customer Purchase Insights</h2>
          <div className="flex gap-2 mb-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-fit justify-between flex"
                >
                  {selectedCustomer !== null
                    ? `Customer ${selectedCustomer.cid} (Zipcode: ${selectedCustomer.zipcode})`
                    : "Select a customer..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search customer..."
                    className="h-9"
                    onValueChange={(value) =>
                      setCustomerId(
                        customerId.filter(
                          (customer) =>
                            customer.zipcode.includes(value) ||
                            customer.cid.toString().includes(value)
                        )
                      )
                    }
                  />
                  <CommandList>
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {customerId.map((customer) => (
                        <CommandItem
                          key={customer.cid}
                          value={customer.cid.toString()}
                          onSelect={(currentValue) => {
                            const newValue = parseInt(currentValue, 10);
                            const selected =
                              customerId.find((c) => c.cid === newValue) ||
                              null;
                            setSelectedCustomer(selected);
                            setOpen(false);
                          }}
                        >
                          {`Customer ${customer.cid} (Zipcode: ${customer.zipcode})`}
                          <CheckIcon
                            className={
                              selectedCustomer?.cid === customer.cid
                                ? "ml-auto h-4 w-4 opacity-100"
                                : "ml-auto h-4 w-4 opacity-0"
                            }
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                        src={
                          imageError[product.productId]
                            ? "/images/products/oil.jpg"
                            : `/images/products/${product.productId}.jpg`
                        }
                        height="500"
                        width="500"
                        alt={"Product Image"}
                        onError={() =>
                          setImageError((prev) => ({
                            ...prev,
                            [product.productId]: true,
                          }))
                        }
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
            <div
              style={{
                width: "100%",
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
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
