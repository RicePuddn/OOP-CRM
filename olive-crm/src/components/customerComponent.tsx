"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip } from "./ui/chart";
import { BarChart as Chart, DollarSign, TrendingUp } from "lucide-react";

interface ProductPurchaseHistoryDTO {
  purchaseCounts: number[];
  purchaseDates: string[];
}

interface TopProductDTO {
  pid: number;
  productName: string;
  totalQuantity: number;
}

interface Customer {
  zipcode: string;
  first_name: string | "Customer";
  last_name: string;
  cid: number;
}
interface SalesMetrics {
  totalSales: number;
  totalAmount: number;
  averageOrderValue: number;
}

export default function CustomerTopProducts() {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [topProducts, setTopProducts] = useState<TopProductDTO[]>([]);
  const [customerId, setCustomerId] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<SalesMetrics>();
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
        console.log("Customer IDs:", response.data);
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
      const metricsResponse = await axios.get(
        `http://localhost:8080/api/orders/metrics?customerId=${selectedCustomer.cid}`
      );

      if (
        purchaseHistoryResponse.data &&
        purchaseHistoryResponse.data.purchaseCounts.length > 0 &&
        metricsResponse.data
      ) {
        console.log("Top Products Response:", topProductsResponse.data);
        setTopProducts(topProductsResponse.data);
        setPurchaseHistory(purchaseHistoryResponse.data);
        setMetrics(metricsResponse.data);
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
  const updateCustomer = async () => {
    if (!selectedCustomer) {
      setError("No customer selected.");
      return;
    }

    try {
      setError(null);
      await axios.put(
        `http://localhost:8080/api/customers/${selectedCustomer.cid}`,
        selectedCustomer
      );
      toast({
        title: "Customer Name Updated",
        description: `Customer name has been successfully updated to ${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
        variant: "success",
      });

      setCustomerId((prev) =>
        prev.map((customer) =>
          customer.cid === selectedCustomer.cid
            ? { ...customer, ...selectedCustomer }
            : customer
        )
      );
    } catch (e) {
      setError("Failed to update customer details.");
      toast({
        title: "Failed to Update Customser Details",
        description: "There was an error in updating the customer details",
        variant: "destructive",
      });
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
                    ? ` ${selectedCustomer.cid} (Zipcode: ${selectedCustomer.zipcode})`
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
                          {`${customer.cid} (Zipcode: ${customer.zipcode})`}
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
          {selectedCustomer && (
            <div className="flex flex-wrap gap-2 items-end mb-4">
              <div className="flex flex-col w-fit">
                <label className="font-semibold mb-2">First Name:</label>
                <input
                  type="text"
                  value={selectedCustomer.first_name ?? "Customer"}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      first_name: e.target.value,
                    })
                  }
                  className="border border-gray-200 rounded-md p-2 w-fit text-sm shadow"
                  placeholder="Enter first name"
                />
              </div>
              <div className="flex flex-col w-fit">
                <label className="font-semibold mb-2">Last Name:</label>
                <input
                  type="text"
                  value={selectedCustomer.last_name ?? selectedCustomer.cid}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      last_name: e.target.value,
                    })
                  }
                  className="border border-gray-200 rounded-md p-2 w-fit text-sm shadow"
                  placeholder="Enter last name"
                />
              </div>
              <div className="w-fit">
                <button
                  className="bg-green-700 text-white hover:bg-green-600 py-2 px-4 rounded-md text-sm"
                  onClick={updateCustomer}
                >
                  Save
                </button>
              </div>
            </div>
          )}

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
            </div>
          )}
        </div>
        {metrics && (
          <div className="p-8 border rounded-lg shadow w-full bg-white mb-8">
            <h3 className="text-lg font-semibold mb-4">Customer Sale Metric</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white shadow-lg rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <Chart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      Total Number of Sales
                    </p>
                    <p className="text-2xl font-bold text-gray-700">
                      {metrics?.totalSales}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-lg rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Sales Amount</p>
                    <p className="text-2xl font-bold text-gray-700">
                      $
                      {metrics?.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-lg rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Average Order Value</p>
                    <p className="text-2xl font-bold text-gray-700">
                      $
                      {metrics?.averageOrderValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

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
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
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
              </ChartContainer>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
