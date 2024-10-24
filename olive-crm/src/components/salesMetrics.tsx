"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { BarChart, DollarSign, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface SalesMetrics {
  totalSales: number;
  totalAmount: number;
   averageOrderValue: number;
}

interface Filters {
  customerId?: number;
  salesType?: string;
  totalCost?: number;
  dateFilterType?: 'single' | 'range';
  singleDate?: string;
  startDate?: string;
  endDate?: string;
}

async function getSalesMetrics(filters: Filters) {
  const queryParams = new URLSearchParams();
  if (filters.customerId) queryParams.append('customerId', filters.customerId.toString());
  if (filters.salesType) queryParams.append('salesType', filters.salesType);
  if (filters.totalCost) queryParams.append('totalCost', filters.totalCost.toString());
  if (filters.dateFilterType) {
    queryParams.append('dateFilterType', filters.dateFilterType);
    if (filters.dateFilterType === 'single' && filters.singleDate) {
      queryParams.append('singleDate', filters.singleDate);
    } else if (filters.dateFilterType === 'range') {
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
    }
  }

  const url = `http://localhost:8080/api/orders/metrics?${queryParams.toString()}`;
  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch sales metrics");
  }
  return res.json();
}

export default function SalesMetrics() {
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalSales: 0,
    totalAmount: 0,
    averageOrderValue: 0
  });
  const [filters, setFilters] = useState<Filters>({
    dateFilterType: 'range'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await getSalesMetrics(filters);
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError("Failed to load sales metrics");
      console.error("Error fetching sales metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === "" ? undefined : 
        (name === "customerId" || name === "totalCost") ? Number(value) : value
    }));
  };

  const applyFilters = () => {
    fetchMetrics();
  };

  const clearFilters = () => {
    setFilters({ dateFilterType: 'range' });
    fetchMetrics();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="flex-grow overflow-auto">
        <div className="h-full w-full px-6 py-8 flex flex-col">
          <h3 className="text-gray-700 text-3xl font-medium mb-6">Sales Performance Metrics</h3>

          {/* Filters Section */}
          <Card className="p-6 bg-white shadow-lg rounded-lg mb-6">
            <h4 className="text-lg font-medium mb-4">Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  name="customerId"
                  type="number"
                  value={filters.customerId || ""}
                  onChange={handleFilterChange}
                  placeholder="Enter customer ID"
                />
              </div>
              <div>
                <Label htmlFor="salesType">Sales Type</Label>
                <Input
                  id="salesType"
                  name="salesType"
                  value={filters.salesType || ""}
                  onChange={handleFilterChange}
                  placeholder="Enter sales type"
                />
              </div>
              <div>
                <Label htmlFor="totalCost">Total Cost</Label>
                <Input
                  id="totalCost"
                  name="totalCost"
                  type="number"
                  value={filters.totalCost || ""}
                  onChange={handleFilterChange}
                  placeholder="Enter total cost"
                />
              </div>
              <div>
                <Label htmlFor="dateFilterType">Date Filter Type</Label>
                <select
                  id="dateFilterType"
                  name="dateFilterType"
                  className="w-full px-3 py-2 border rounded-md"
                  value={filters.dateFilterType}
                  onChange={handleFilterChange}
                >
                  <option value="single">Single Date</option>
                  <option value="range">Date Range</option>
                </select>
              </div>
              {filters.dateFilterType === 'single' ? (
                <div>
                  <Label htmlFor="singleDate">Date</Label>
                  <Input
                    id="singleDate"
                    name="singleDate"
                    type="date"
                    value={filters.singleDate || ""}
                    onChange={handleFilterChange}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={filters.startDate || ""}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={filters.endDate || ""}
                      onChange={handleFilterChange}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white shadow-lg rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <BarChart className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Number of Sales</p>
                  <p className="text-2xl font-bold text-gray-700">{metrics.totalSales}</p>
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
                    ${metrics.totalAmount.toLocaleString(undefined, {
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
                    ${metrics.averageOrderValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
