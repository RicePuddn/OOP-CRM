// Previous imports remain the same
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ChartData, ChartOptions } from "chart.js";

// Register Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DynamicPie = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
);

interface Product {
  pID: number;
  productName: string;
  individualPrice: number;
}

interface TopProduct {
  PID: number;
  productName: string;
  totalQuantity: number;
  individualPrice: number;
}

interface CustomerDetail {
  id: number;
  name: string;
  topProducts: TopProduct[];
}

interface CustomerSegment {
  customerIds: number[];
  segmentType: string;
  segmentCategory: string;
  customerDetails?: CustomerDetail[];
}

// Common fetch options for all API calls
const fetchOptions: RequestInit = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  mode: 'cors'
};

export default function CustomerSegmentation() {
  const [segments, setSegments] = useState<Record<string, CustomerSegment>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "Recency" | "Frequency" | "Monetary"
  >("Recency");
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products', fetchOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData: Product[] = await response.json();
        console.log('Fetched products with prices:', productsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      }
    };

    fetchProducts();
    fetchAllSegments();
  }, []);

  const getProductPrice = (pid: number): number | undefined => {
    const product = products.find(p => p.pID === pid);
    if (!product) {
      console.warn(`No matching product found for ID: ${pid}`);
      return undefined;
    }
    console.log(`Found price for product ${pid}: ${product.individualPrice}`);
    return product.individualPrice;
  };

  const fetchCustomerDetails = async (customerId: number): Promise<CustomerDetail | null> => {
    try {
      const topProductsResponse = await fetch(`http://localhost:8080/api/orders/customer/${customerId}/top-products`, fetchOptions);
      if (!topProductsResponse.ok) {
        throw new Error(`Failed to fetch top products for customer ${customerId}`);
      }
      
      const topProducts: TopProduct[] = await topProductsResponse.json();
      console.log(`Top products for customer ${customerId}:`, topProducts);
      
      return {
        id: customerId,
        name: `Customer ${customerId}`,
        topProducts: topProducts
      };
    } catch (error) {
      console.error(`Error fetching details for customer ${customerId}:`, error);
      return null;
    }
  };

  const fetchAllSegments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all segment types in parallel
      const [recencyResponse, frequencyResponse, monetaryResponse] = await Promise.all([
        fetch("http://localhost:8080/api/orders/segments/recency", fetchOptions),
        fetch("http://localhost:8080/api/orders/segments/frequency", fetchOptions),
        fetch("http://localhost:8080/api/orders/segments/monetary", fetchOptions)
      ]);

      const recencySegments = await recencyResponse.json();
      const frequencySegments = await frequencyResponse.json();
      const monetarySegments = await monetaryResponse.json();

      const allSegments: Record<string, CustomerSegment> = {};

      // Process all segments
      [...recencySegments, ...frequencySegments, ...monetarySegments].forEach(segment => {
        allSegments[segment.segmentType] = segment;
      });

      // Fetch customer details for each segment
      for (const segmentKey in allSegments) {
        const segment = allSegments[segmentKey];
        const customerDetails = await Promise.all(
          segment.customerIds.map(id => fetchCustomerDetails(id))
        );
        segment.customerDetails = customerDetails.filter((detail): detail is CustomerDetail => detail !== null);
      }

      console.log("Fetched segments with details:", allSegments);
      setSegments(allSegments);
    } catch (error) {
      console.error("Error fetching segments:", error);
      setError("Failed to fetch customer segments");
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (
    category: "Recency" | "Frequency" | "Monetary"
  ): ChartData<"pie"> => {
    const categorySegments = Object.entries(segments).filter(
      ([, segment]) => segment.segmentCategory === category
    );

    console.log(`Segments for ${category}:`, categorySegments);

    const labels = categorySegments.map(([type]) => type);
    const data = categorySegments.map(
      ([, segment]) => segment.customerIds.length
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const renderCustomerCounts = (
    category: "Recency" | "Frequency" | "Monetary"
  ) => {
    const categorySegments = Object.entries(segments).filter(
      ([, segment]) => segment.segmentCategory === category
    );

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-4 text-black">Total Number of Customers</h4>
        <ul className="space-y-2">
          {categorySegments.map(([type, segment]) => (
            <li key={type} className="text-black">
              {type} - {segment.customerIds.length}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSegmentList = (
    category: "Recency" | "Frequency" | "Monetary"
  ) => {
    const categorySegments = Object.entries(segments).filter(
      ([, segment]) => segment.segmentCategory === category
    );

    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5 },
        }}
      >
        <div className="mt-4 grid grid-cols-1 gap-4">
          {categorySegments.map(([type, segment]) => (
            <div key={type} className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-2 text-black">{type}</h4>
              <p className="text-black">
                Number of customers: {segment.customerIds.length}
              </p>
              <div className="mt-2">
                <details>
                  <summary className="cursor-pointer text-blue-500">
                    View Customer IDs
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-black">
                    {segment.customerIds.join(", ")}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {categorySegments.map(([type, segment]) => (
          <div key={type} className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-2 text-black">{type}</h4>
            <p className="text-black">
              Number of customers: {segment.customerIds.length}
            </p>
            <div className="mt-2">
              <details>
                <summary className="cursor-pointer text-blue-500">
                  View Customer Details
                </summary>
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Top 3 Products (ID - Name - Price)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {segment.customerDetails?.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <ul>
                              {customer.topProducts.map((product, index) => (
                                <li key={index}>
                                  {product.PID} - {product.productName} - ${product.individualPrice.toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: "Recency", label: "Recency Analysis" },
    { id: "Frequency", label: "Frequency Analysis" },
    { id: "Monetary", label: "Monetary Analysis" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">
        Customer Segmentation Analysis
      </h2>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "Recency" | "Frequency" | "Monetary")
                }
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-black hover:text-gray-900 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Distribution Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-black">
            Distribution Chart
          </h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <div style={{ height: "300px" }}>
              {typeof window !== "undefined" && (
                <DynamicPie
                  data={getChartData(activeTab)}
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">
            Customer Count
          </h3>
          {renderCustomerCounts(activeTab)}
        </div>
      </div>

      {/* Segment Details Row */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-black">
          Segment Details
        </h3>
        {renderSegmentList(activeTab)}
      </div>
    </div>
  );
}
