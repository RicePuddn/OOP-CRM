import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ChartData, ChartOptions } from "chart.js";
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
import { Search } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"Recency" | "Frequency" | "Monetary">("Recency");
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    customer: CustomerDetail;
    segmentType: string;
    segmentCategory: string;
  }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products', fetchOptions);
        if (!response.ok) throw new Error('Failed to fetch products');
        const productsData: Product[] = await response.json();
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
    return product?.individualPrice;
  };

  const fetchCustomerDetails = async (customerId: number): Promise<CustomerDetail | null> => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/customer/${customerId}/top-products`,
        fetchOptions
      )
      ;
      if (!response.ok) throw new Error(`Failed to fetch top products for customer ${customerId}`);
      const topProducts: TopProduct[] = await response.json();
      
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
      const [recencyResponse, frequencyResponse, monetaryResponse] = await Promise.all([
        fetch("http://localhost:8080/api/orders/segments/recency", fetchOptions),
        fetch("http://localhost:8080/api/orders/segments/frequency", fetchOptions),
        fetch("http://localhost:8080/api/orders/segments/monetary", fetchOptions)
      ]);

      const recencySegments = await recencyResponse.json();
      const frequencySegments = await frequencyResponse.json();
      const monetarySegments = await monetaryResponse.json();

      const allSegments: Record<string, CustomerSegment> = {};
      [...recencySegments, ...frequencySegments, ...monetarySegments].forEach(segment => {
        allSegments[segment.segmentType] = segment;
      });

      for (const segmentKey in allSegments) {
        const segment = allSegments[segmentKey];
        const customerDetails = await Promise.all(
          segment.customerIds.map(id => fetchCustomerDetails(id))
        );
        segment.customerDetails = customerDetails.filter((detail): detail is CustomerDetail => detail !== null);
      }

      setSegments(allSegments);
    } catch (error) {
      setError("Failed to fetch customer segments");
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (category: "Recency" | "Frequency" | "Monetary"): ChartData<"pie"> => {
    const categorySegments = Object.entries(segments).filter(
      ([, segment]) => segment.segmentCategory === category
    );

    return {
      labels: categorySegments.map(([type]) => type),
      datasets: [{
        data: categorySegments.map(([, segment]) => segment.customerIds.length),
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(251, 146, 60, 0.8)"
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(251, 146, 60, 1)"
        ],
        borderWidth: 2
      }]
    };
  };

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold"
        },
        bodyFont: {
          size: 13
        }
      }
    }
  };

  const renderCustomerCounts = (category: "Recency" | "Frequency" | "Monetary") => {
    const categorySegments = Object.entries(segments).filter(
      ([, segment]) => segment.segmentCategory === category
    );

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Customer Distribution</h4>
        <div className="space-y-3">
          {categorySegments.map(([type, segment]) => (
            <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{type}</span>
              <span className="text-indigo-600 font-semibold">{segment.customerIds.length}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  //Search Component
  const handleSearch = () => {
    setIsSearching(true);
    const results: {
      customer: CustomerDetail;
      segmentType: string;
      segmentCategory: string;
    }[] = [];

    const trimmedQuery = searchQuery.trim();
    const isNumericSearch = !isNaN(Number(trimmedQuery));

    Object.entries(segments).forEach(([segmentType, segment]) => {
      segment.customerDetails?.forEach((customer) => {
        if (isNumericSearch) {
          // For numeric searches, do exact match on customer ID
          if (customer.id === Number(trimmedQuery)) {
            results.push({
              customer,
              segmentType,
              segmentCategory: segment.segmentCategory,
            });
          }
        } else {
          // For text searches, do case-insensitive partial match on customer name
          if (customer.name.toLowerCase().includes(trimmedQuery.toLowerCase())) {
            results.push({
              customer,
              segmentType,
              segmentCategory: segment.segmentCategory,
            });
          }
        }
      });
    });

    setSearchResults(results);
  };

  // Search results component
  const renderSearchResults = () => {
    if (!isSearching) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
          <button
            onClick={() => {
              setIsSearching(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear Search
          </button>
        </div>

        {searchResults.length === 0 ? (
          <p className="text-gray-500">No customers found matching your search.</p>
        ) : (
          <div className="overflow-x-auto">
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
                    Segment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top Products
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((result, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.customer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.segmentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.segmentCategory}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1 text-sm text-gray-700">
                        {result.customer.topProducts.map((product, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-600">
                              {index + 1}
                            </span>
                            <span>{product.productName}</span>
                            <span className="text-green-600">
                              ${product.individualPrice.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    );
  };

  const renderSegmentList = (category: "Recency" | "Frequency" | "Monetary") => {
    const categorySegments = Object.entries(segments).filter(
      ([, segment]) => segment.segmentCategory === category
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {categorySegments.map(([type, segment]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{type}</h4>
                <span className="px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  {segment.customerIds.length} customers
                </span>
              </div>
              
              <details className="group">
                <summary className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
                  <span>View Details</span>
                  <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Products</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {segment.customerDetails?.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                          <td className="px-6 py-4">
                            <ul className="space-y-1 text-sm text-gray-700">
                              {customer.topProducts.map((product, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-600">
                                    {index + 1}
                                  </span>
                                  <span>{product.productName}</span>
                                  <span className="text-green-600">${product.individualPrice.toFixed(2)}</span>
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
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Segmentation Analysis
          </h2>
          
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or name..."
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </div>
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {renderSearchResults()}

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            {[
              { id: "Recency", label: "Recency Analysis" },
              { id: "Frequency", label: "Frequency Analysis" },
              { id: "Monetary", label: "Monetary Analysis" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "Recency" | "Frequency" | "Monetary")
                }
                className={`
                  pb-4 px-1 border-b-2 font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Chart and Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Distribution Chart
              </h3>
              <div className="h-[400px]">
                {typeof window !== "undefined" && (
                  <DynamicPie data={getChartData(activeTab)} options={chartOptions} />
                )}
              </div>
            </div>

            <div className="space-y-6">{renderCustomerCounts(activeTab)}</div>
          </div>

          {/* Segment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900">
              Segment Details
            </h3>
            {renderSegmentList(activeTab)}
          </div>
        </div>
      </div>
    </div>
  );
}
