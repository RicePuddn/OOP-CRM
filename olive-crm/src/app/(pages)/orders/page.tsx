'use client';

import React, { useState, useEffect } from 'react';
import OrderFilter from '@/components/OrderFilter';

interface Order {
  id: number;
  customer?: { cid: string };
  productName: string;
  quantity: number;
  totalCost: number;
  orderMethod: string;
  salesDate: string;
  salesType: string;
  shippingMethod: string;
}

// Define filter types
interface Filters {
  customerId: number | null;
  salesType: string;
  salesDate: string | null; // Use null for optional date
  totalCost: number | null; // Change to number
}

async function getOrders(page = 0, size = 20, filters: Filters) {
  const filterParams = new URLSearchParams({ 
    page: String(page), 
    size: String(size),
    customerId: filters.customerId !== null ? String(filters.customerId) : '',
    salesType: filters.salesType,
    salesDate: filters.salesDate || '',
    totalCost: filters.totalCost !== null ? String(filters.totalCost) : ''
  }).toString();
  
  const res = await fetch(`http://localhost:8080/api/orders?${filterParams}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [jumpToPage, setJumpToPage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    customerId: null,
    salesType: '',
    salesDate: null,
    totalCost: null,
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filters]); // Fetch orders whenever currentPage or filters change

  const fetchOrders = async () => {
    try {
      const data = await getOrders(currentPage, 20, filters);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage, 10) - 1;
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpToPage('');
  };

  const handleFilterApply = () => {
    setCurrentPage(0); // Reset to first page
    fetchOrders();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-6 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>
          <OrderFilter
            filters={filters}
            setFilters={setFilters} // This should work with the original filter format
            onApply={handleFilterApply} // Ensure this function exists in OrderFilter
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
          />
          <div className="flex-grow bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="overflow-x-auto flex-grow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Method</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer ? order.customer.cid : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.salesDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.salesType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage + 1} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
