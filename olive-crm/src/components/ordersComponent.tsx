"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

interface Filters {
  customerId: string;
  salesType: string;
  totalCost: string;
  dateFilterType: "single" | "range";
  singleDate: string;
  startDate: string;
  endDate: string;
}

interface Order {
  id: number;
  customer: { cid: number };
  product: { productName: string };
  quantity: number;
  totalCost: number;
  orderMethod: string;
  salesDate: string;
  salesType: string;
  shippingMethod: string;
}

const SALES_TYPE_OPTIONS = ["Direct - B2B", "Consignment", "Marketing"];

async function getOrders(page = 0, size = 20, filters: Filters) {
  const hasFilters = Object.values(filters).some((value) => value !== "");
  const endpoint = hasFilters
    ? "http://localhost:8080/api/orders/filter"
    : "http://localhost:8080/api/orders";

  const filterParams: Record<string, string> = {};

  if (filters.customerId) filterParams.customerId = filters.customerId;
  if (filters.salesType) filterParams.salesType = filters.salesType;
  if (filters.totalCost) filterParams.totalCost = filters.totalCost;

  filterParams.dateFilterType = filters.dateFilterType;

  if (filters.dateFilterType === "single" && filters.singleDate) {
    filterParams.singleDate = filters.singleDate;
  } else if (
    filters.dateFilterType === "range" &&
    filters.startDate &&
    filters.endDate
  ) {
    filterParams.startDate = filters.startDate;
    filterParams.endDate = filters.endDate;
  }

  filterParams.page = String(page);
  filterParams.size = String(size);

  const queryString = new URLSearchParams(filterParams).toString();
  const res = await fetch(`${endpoint}?${queryString}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}

async function exportOrdersToCSV(filters: Filters) {
  const filterParams: Record<string, string> = {};

  if (filters.customerId) filterParams.customerId = filters.customerId;
  if (filters.salesType) filterParams.salesType = filters.salesType;
  if (filters.totalCost) filterParams.totalCost = filters.totalCost;

  filterParams.dateFilterType = filters.dateFilterType;

  if (filters.dateFilterType === "single" && filters.singleDate) {
    filterParams.singleDate = filters.singleDate;
  } else if (
    filters.dateFilterType === "range" &&
    filters.startDate &&
    filters.endDate
  ) {
    filterParams.startDate = filters.startDate;
    filterParams.endDate = filters.endDate;
  }

  const queryString = new URLSearchParams(filterParams).toString();
  const endpoint = "http://localhost:8080/api/orders/export/csv";

  try {
    const response = await fetch(`${endpoint}?${queryString}`);
    if (!response.ok) throw new Error("Export failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error exporting orders:", error);
    alert("Failed to export orders. Please try again.");
  }
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [jumpToPage, setJumpToPage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    customerId: "",
    salesType: "",
    totalCost: "",
    dateFilterType: "single",
    singleDate: "",
    startDate: "",
    endDate: "",
  });
  const [applyFilter, setApplyFilter] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(currentPage, 20, filters);
      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(Math.ceil(data.length / 20));
      } else if (data && data.content && Array.isArray(data.content)) {
        setOrders(data.content);
        setTotalPages(data.totalPages || Math.ceil(data.content.length / 20));
      } else {
        setOrders([]);
        setTotalPages(0);
      }
    } catch (error) {
      setOrders([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, applyFilter]);

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage, 10) - 1;
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpToPage("");
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterApply = () => {
    setCurrentPage(0);
    setApplyFilter((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      customerId: "",
      salesType: "",
      totalCost: "",
      dateFilterType: "single",
      singleDate: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(0);
    setApplyFilter((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleExport = () => {
    exportOrdersToCSV(filters);
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
      <div className="flex flex-col h-full w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-700 text-3xl font-medium">Orders</h3>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              Export to CSV
            </button>
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              {isDropdownOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilterApply();
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="customerId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer ID:
                </label>
                <input
                  type="number"
                  name="customerId"
                  value={filters.customerId}
                  onChange={handleFilterChange}
                  placeholder="Enter Customer ID"
                  className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div>
                <label
                  htmlFor="salesType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sales Type:
                </label>
                <select
                  name="salesType"
                  value={filters.salesType}
                  onChange={handleFilterChange}
                  className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  <option value="">Select Sales Type</option>
                  {SALES_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="totalCost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Cost:
                </label>
                <input
                  type="number"
                  name="totalCost"
                  value={filters.totalCost}
                  onChange={handleFilterChange}
                  placeholder="Enter Amount"
                  className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div>
                <label
                  htmlFor="dateFilterType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Filter:
                </label>
                <select
                  name="dateFilterType"
                  value={filters.dateFilterType}
                  onChange={handleFilterChange}
                  className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  <option value="single">Single Date</option>
                  <option value="range">Date Range</option>
                </select>
              </div>
              {filters.dateFilterType === "single" ? (
                <div>
                  <label
                    htmlFor="singleDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sales Date:
                  </label>
                  <input
                    type="date"
                    name="singleDate"
                    value={filters.singleDate}
                    onChange={handleFilterChange}
                    className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date:
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date:
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                </>
              )}
              <button
                type="submit"
                className="mt-4 px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 text-sm bg-gray-400 text-white rounded hover:bg-gray-300 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </form>
          </div>
        )}

        <div className="bg-white flex-grow overflow-auto rounded-lg shadow">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.id}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.customer ? order.customer.cid : "N/A"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.product ? order.product.productName : "N/A"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.quantity}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        ${order.totalCost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border-t">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="Jump to page..."
                className="px-3 py-1.5 text-sm border rounded w-32 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <button
                onClick={handleJumpToPage}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
