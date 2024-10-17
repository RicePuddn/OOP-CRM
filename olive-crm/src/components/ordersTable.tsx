'use client';

import React, { useState, useEffect } from 'react';

async function getOrders(page = 0, size = 20, filters = {}) {
  const filterParams = new URLSearchParams();
  
  // Add filter parameters only if they have a value
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      filterParams.append(key, value.toString());
    }
  });

  // Add pagination parameters
  filterParams.append('page', String(page));
  filterParams.append('size', String(size));

  const url = `http://localhost:8080/api/orders/filter?${filterParams.toString()}`;
  console.log('Fetching orders with URL:', url);

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [jumpToPage, setJumpToPage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    customerId: '',
    salesType: '',
    minTotalCost: '',
    maxTotalCost: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filters]);

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterApply = () => {
    setCurrentPage(0);
    fetchOrders();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-6 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>
          
          <div className="mb-4 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4 text-black">Filter Orders</h2>
            <button
              onClick={toggleDropdown}
              className="text-left w-full bg-blue-500 text-white py-2 rounded"
            >
              {isDropdownOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            {isDropdownOpen && (
              <form onSubmit={(e) => { e.preventDefault(); handleFilterApply(); }} className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="customerId" className="block text-gray-700 font-medium mb-1">Customer ID:</label>
                    <input
                      type="number"
                      name="customerId"
                      value={filters.customerId}
                      onChange={handleFilterChange}
                      placeholder="Enter Customer ID"
                      className="px-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="salesType" className="block text-gray-700 font-medium mb-1">Sales Type:</label>
                    <input
                      type="text"
                      name="salesType"
                      value={filters.salesType}
                      onChange={handleFilterChange}
                      placeholder="Enter Sales Type (e.g., Marketing, Direct - B2C)"
                      className="px-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="minTotalCost" className="block text-gray-700 font-medium mb-1">Min Total Cost:</label>
                    <input
                      type="number"
                      name="minTotalCost"
                      value={filters.minTotalCost}
                      onChange={handleFilterChange}
                      placeholder="Enter Min Total Cost"
                      className="px-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxTotalCost" className="block text-gray-700 font-medium mb-1">Max Total Cost:</label>
                    <input
                      type="number"
                      name="maxTotalCost"
                      value={filters.maxTotalCost}
                      onChange={handleFilterChange}
                      placeholder="Enter Max Total Cost"
                      className="px-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-gray-700 font-medium mb-1">Start Date:</label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="px-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-gray-700 font-medium mb-1">End Date:</label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="px-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Apply Filter
                  </button>
                </div>
              </form>
            )}
          </div>
          
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
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer ? order.customer.cid : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product ? order.product.productName : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalCost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.salesDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.salesType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center p-4">
              <div>
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Next
                </button>
              </div>
              <div>
                <input
                  type="text"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder="Jump to page..."
                  className="px-4 py-2 border rounded w-32 focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button onClick={handleJumpToPage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
