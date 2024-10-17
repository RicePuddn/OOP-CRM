import React from 'react';

interface Filters {
  customerId: number | null;
  salesType: string;
  salesDate: string | null;
  totalCost: number | null;
}

interface OrderFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApply: () => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  filters,
  setFilters,
  onApply,
  isDropdownOpen,
  toggleDropdown,
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {isDropdownOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {isDropdownOpen && (
        <div className="flex flex-wrap justify-between mt-2 bg-gray-50 p-4 rounded shadow-md">
          {/* Filter Item for Customer ID */}
          <div className="flex items-center mr-4 mb-2">
            <label className="mr-2 font-semibold text-gray-700">Customer ID:</label>
            <input
              type="number"
              value={filters.customerId || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ ...filters, customerId: value ? parseInt(value) : null });
              }}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-green-500 transition duration-200"
              placeholder="Enter Customer ID"
            />
          </div>

          {/* Filter Item for Sales Type */}
          <div className="flex items-center mr-4 mb-2">
            <label className="mr-2 font-semibold text-gray-700">Sales Type:</label>
            <input
              type="text"
              value={filters.salesType}
              onChange={(e) => setFilters({ ...filters, salesType: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-green-500 transition duration-200"
              placeholder="Enter Sales Type"
            />
          </div>

          {/* Filter Item for Sales Date */}
          <div className="flex items-center mr-4 mb-2">
            <label className="mr-2 font-semibold text-gray-700">Sales Date:</label>
            <input
              type="date"
              value={filters.salesDate || ''}
              onChange={(e) => setFilters({ ...filters, salesDate: e.target.value || null })}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-green-500 transition duration-200"
            />
          </div>

          {/* Filter Item for Total Cost */}
          <div className="flex items-center mr-4 mb-2">
            <label className="mr-2 font-semibold text-gray-700">Total Cost:</label>
            <input
              type="number"
              value={filters.totalCost || ''}
              onChange={(e) => setFilters({ ...filters, totalCost: parseFloat(e.target.value) || null })}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-green-500 transition duration-200"
              placeholder="Enter Total Cost"
            />
          </div>

          {/* Apply Filters Button positioned at the bottom left */}
          <div className="w-full mt-4 flex justify-start">
            <button
              onClick={onApply}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilter;
