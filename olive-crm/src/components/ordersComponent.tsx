"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { EditCustomerDialog } from "./ui/edit-customer-dialog";

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
  customer: { 
    cid: number;
    first_name?: string;
    last_name?: string;
    zipcode?: string;
  };
  product: { productName: string };
  quantity: number;
  totalCost: number;
  orderMethod: string;
  salesDate: string;
  salesType: string;
  shippingMethod: string;
}

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    first_name: string;
    last_name: string;
    zipcode: string;
  } | null>(null);

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

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchOrders();
      } else {
        console.error('Failed to delete order');
        alert('Failed to delete order. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again.');
    }
  };

  const handleEditCustomer = async (customerId: number, data: { first_name: string; last_name: string; zipcode: string }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchOrders(); // Refresh the orders list to show updated customer details
      } else {
        console.error('Failed to update customer');
        alert('Failed to update customer. Please try again.');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer. Please try again.');
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
            <Button
              onClick={handleExport}
              className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              Export to CSV
            </Button>
            <Button
              onClick={toggleDropdown}
              className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              {isDropdownOpen ? "Hide Filters" : "Show Filters"}
            </Button>
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
              {/* First Row */}
              <div>
                <label
                  htmlFor="customerId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer ID:
                </label>
                <Input
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
                <Select
                  value={filters.salesType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, salesType: value }))
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select sales type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sales Type</SelectLabel>
                      <SelectItem value="Direct - B2B">Direct - B2B</SelectItem>
                      <SelectItem value="Direct - B2C">Direct - B2C</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Consignment">Consignment</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="totalCost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Cost:
                </label>
                <Input
                  type="number"
                  name="totalCost"
                  value={filters.totalCost}
                  onChange={handleFilterChange}
                  placeholder="Enter Amount"
                  className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>

              {/* Second Row - Date Filter Type */}
              <div>
                <label
                  htmlFor="dateFilterType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Filter:
                </label>
                <Select
                  value={filters.dateFilterType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFilterType: value as "single" | "range",
                    }))
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Date Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Date Type</SelectLabel>
                      <SelectItem value="single">Single Date</SelectItem>
                      <SelectItem value="range">Date Range</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Input Fields */}
              {filters.dateFilterType === "single" ? (
                <>
                  <div>
                    <label
                      htmlFor="singleDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sales Date:
                    </label>
                    <Input
                      type="date"
                      name="singleDate"
                      value={filters.singleDate}
                      onChange={handleFilterChange}
                      className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                  <div></div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date:
                    </label>
                    <Input
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
                    <Input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons - Always in the last row */}
              <div className="col-span-3 flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm bg-gray-400 text-white rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear Filters
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Apply Filters
                </Button>
              </div>
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
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                      <td className="px-3 py-3 whitespace-nowrap text-sm space-x-2">
                        <Button
                          onClick={() => {
                            setSelectedCustomer({
                              id: order.customer.cid,
                              first_name: order.customer.first_name || '',
                              last_name: order.customer.last_name || '',
                              zipcode: order.customer.zipcode || ''
                            });
                            setEditDialogOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          Delete
                        </Button>
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

      {selectedCustomer && (
        <EditCustomerDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedCustomer(null);
          }}
          customerId={selectedCustomer.id}
          onSave={handleEditCustomer}
          initialData={{
            first_name: selectedCustomer.first_name,
            last_name: selectedCustomer.last_name,
            zipcode: selectedCustomer.zipcode
          }}
        />
      )}
    </motion.section>
  );
}
