"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";

interface UploadRecord {
  filename: string;
  status: 'success' | 'error';
  message: string;
  timestamp: Date;
}

interface ManualOrder {
  customerId: number;
  productId: number;
  quantity: number;
  totalCost: number;
  salesType: string;
  salesDate: string;
}

const CsvUploadForm: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([]);
  const [manualOrder, setManualOrder] = useState<ManualOrder>({
    customerId: 0,
    productId: 0,
    quantity: 0,
    totalCost: 0,
    salesType: '',
    salesDate: new Date().toISOString().split('T')[0]
  });
  const [orderStatus, setOrderStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const updateUploadHistory = (record: UploadRecord) => {
    setUploadHistory(prev => [record, ...prev]);
  };

  const handleManualOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualOrder(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'totalCost' || name === 'customerId' || name === 'productId' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleManualOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/orders/manual', manualOrder);
      setOrderStatus({
        message: 'Order created successfully',
        type: 'success'
      });
      // Reset form
      setManualOrder({
        customerId: 0,
        productId: 0,
        quantity: 0,
        totalCost: 0,
        salesType: '',
        salesDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      setOrderStatus({
        message: error instanceof Error ? error.message : 'Error creating order',
        type: 'error'
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!files || files.length === 0) {
      updateUploadHistory({
        filename: '',
        status: 'error',
        message: 'Please select at least one file',
        timestamp: new Date()
      });
      return;
    }

    setUploading(true);

    // Process files sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(
          "http://localhost:8080/api/upload-csv",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        updateUploadHistory({
          filename: file.name,
          status: 'success',
          message: 'File uploaded successfully',
          timestamp: new Date()
        });
      } catch (error) {
        updateUploadHistory({
          filename: file.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Error uploading file',
          timestamp: new Date()
        });
      }
    }

    setUploading(false);
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setFiles(null);
  };

  const clearHistory = () => {
    setUploadHistory([]);
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
      <div className="w-full px-6 py-8">
        <h3 className="text-gray-700 text-3xl font-medium">Update Orders</h3>
        
        {/* Manual Order Entry Card */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Manual Order Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    name="customerId"
                    type="number"
                    required
                    value={manualOrder.customerId || ''}
                    onChange={handleManualOrderChange}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    name="productId"
                    type="number"
                    required
                    value={manualOrder.productId || ''}
                    onChange={handleManualOrderChange}
                    placeholder="Enter product ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    value={manualOrder.quantity || ''}
                    onChange={handleManualOrderChange}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCost">Total Cost</Label>
                  <Input
                    id="totalCost"
                    name="totalCost"
                    type="number"
                    step="0.01"
                    required
                    value={manualOrder.totalCost || ''}
                    onChange={handleManualOrderChange}
                    placeholder="Enter total cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesType">Sales Type</Label>
                  <select
                    id="salesType"
                    name="salesType"
                    required
                    value={manualOrder.salesType}
                    onChange={handleManualOrderChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select sales type</option>
                    <option value="Direct - B2B">Direct - B2B</option>
                    <option value="Direct - B2C">Direct - B2C</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Consignment">Consignment</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesDate">Sales Date</Label>
                  <Input
                    id="salesDate"
                    name="salesDate"
                    type="date"
                    required
                    value={manualOrder.salesDate}
                    onChange={handleManualOrderChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-800 hover:bg-green-700">
                Create Order
              </Button>
              {orderStatus && (
                <div className={`mt-2 p-2 rounded ${
                  orderStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {orderStatus.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-lg font-medium mb-3">CSV Upload Instructions</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>What you can do:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Upload multiple CSV files at once, using Ctrl or Shift to select multiple files.</li>
                <li>View upload status for each file</li>
                <li>Clear the upload history</li>
              </ul>
              
              <p className="mt-4"><strong>CSV File Requirements:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Files must be in CSV format (.csv extension)</li>
                <li>Required columns:
                  <ul className="list-[circle] pl-5 mt-1">
                    <li>Sale Date (format: DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD)</li>
                    <li>Sale Type</li>
                    <li>Digital (Yes/No)</li>
                    <li>Customer ID (numeric)</li>
                    <li>Zip Code</li>
                    <li>Shipping Method</li>
                    <li>Product Name</li>
                    <li>Product Variant</li>
                    <li>Quantity (numeric)</li>
                    <li>Price (numeric)</li>
                    <li>Product Price (numeric)</li>
                  </ul>
                </li>
                <li>First row should contain column headers</li>
                <li>All numeric fields should contain valid numbers</li>
              </ul>

              <p className="mt-4"><strong>Important Notes:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Please remain on this page while files are being uploaded</li>
                <li>Files are processed one at a time</li>
                <li>Large files may take longer to process</li>
                <li>If you encounter errors, check the file format and try again</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>CSV Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Please remain on this page while files are being uploaded.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-green-800 hover:bg-green-700"
                >
                  {uploading ? "Uploading..." : "Upload CSV Files"}
                </Button>
              </form>

              {/* Upload History */}
              {uploadHistory.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-medium">Upload History</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                      className="text-sm"
                    >
                      Clear History
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {uploadHistory.map((record, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          record.status === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {record.filename || 'Upload Attempt'}
                            </p>
                            <p className={`text-sm ${
                              record.status === 'success'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {record.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {record.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
};

export default CsvUploadForm;
