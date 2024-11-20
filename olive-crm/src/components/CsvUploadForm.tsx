"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectLabel,
} from "./ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface UploadRecord {
  filename: string;
  status: "success" | "error";
  message: string;
  timestamp: Date;
}

interface ManualOrder {
  customerId?: number;
  productId: number;
  quantity: number;
  totalCost: number;
  salesType: string;
  salesDate: string;
  zipcode?: string;
  firstName?: string;
  lastName?: string;
}

const CsvUploadForm: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileList | null>(null);
  const [customerNameFiles, setCustomerNameFiles] = useState<FileList | null>(
    null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([]);
  const [manualOrder, setManualOrder] = useState<ManualOrder>({
    customerId: undefined,
    productId: 0,
    quantity: 0,
    totalCost: 0,
    salesType: "",
    salesDate: new Date().toISOString().split("T")[0],
    zipcode: "",
    firstName: "",
    lastName: "",
  });
  const [orderStatus, setOrderStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleCustomerNameFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setCustomerNameFiles(event.target.files);
    }
  };

  const updateUploadHistory = (record: UploadRecord) => {
    setUploadHistory((prev) => [record, ...prev]);
  };

  const handleManualOrderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setManualOrder((prev) => ({
      ...prev,
      [name]:
        name === "quantity" ||
        name === "totalCost" ||
        name === "customerId" ||
        name === "productId"
          ? value
            ? parseFloat(value)
            : undefined
          : value,
    }));
  };

  const handleManualOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/orders/manual", manualOrder);
      setOrderStatus({
        message: "Order created successfully",
        type: "success",
      });
      toast({
        title: "Order Entry Created Successfully",
        description: "Successful manual entry creation",
        variant: "success",
      });
      // Reset form
      setManualOrder({
        customerId: undefined,
        productId: 0,
        quantity: 0,
        totalCost: 0,
        salesType: "",
        salesDate: new Date().toISOString().split("T")[0],
        zipcode: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      setOrderStatus({
        message:
          error instanceof Error ? error.message : "Error creating order",
        type: "error",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!files || files.length === 0) {
      updateUploadHistory({
        filename: "",
        status: "error",
        message: "Please select at least one file",
        timestamp: new Date(),
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
        await axios.post("http://localhost:8080/api/upload-csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast({
          title: "Standard File Upload Successful",
          description:
            "Successfully uploaded standard CSV file with no customer names",
          variant: "success",
        });

        updateUploadHistory({
          filename: file.name,
          status: "success",
          message: "File uploaded successfully",
          timestamp: new Date(),
        });
      } catch (error) {
        updateUploadHistory({
          filename: file.name,
          status: "error",
          message:
            error instanceof Error ? error.message : "Error uploading file",
          timestamp: new Date(),
        });
      }
    }

    setUploading(false);
    // Clear file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setFiles(null);
  };

  const handleCustomerNamesSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!customerNameFiles || customerNameFiles.length === 0) {
      updateUploadHistory({
        filename: "",
        status: "error",
        message: "Please select at least one file",
        timestamp: new Date(),
      });
      return;
    }

    setUploading(true);

    // Process files sequentially
    for (let i = 0; i < customerNameFiles.length; i++) {
      const file = customerNameFiles[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(
          "http://localhost:8080/api/upload-customer-names-csv",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast({
          title: "Customer Named File Upload Successful",
          description: "Successfully uploaded Customer Named CSV file",
          variant: "success",
        });
        updateUploadHistory({
          filename: file.name,
          status: "success",
          message: "Customer names CSV file uploaded successfully",
          timestamp: new Date(),
        });
      } catch (error) {
        updateUploadHistory({
          filename: file.name,
          status: "error",
          message:
            error instanceof Error ? error.message : "Error uploading file",
          timestamp: new Date(),
        });
      }
    }

    setUploading(false);
    // Clear file input
    const fileInput = document.querySelector(
      "#customerNamesFileInput"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setCustomerNameFiles(null);
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
                  <Label htmlFor="customerId">
                    Customer ID (optional for new customers)
                  </Label>
                  <Input
                    id="customerId"
                    name="customerId"
                    type="number"
                    value={manualOrder.customerId || ""}
                    onChange={handleManualOrderChange}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">Zip Code (optional)</Label>
                  <Input
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    value={manualOrder.zipcode || ""}
                    onChange={handleManualOrderChange}
                    placeholder="Enter zip code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name (optional)</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={manualOrder.firstName || ""}
                    onChange={handleManualOrderChange}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name (optional)</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={manualOrder.lastName || ""}
                    onChange={handleManualOrderChange}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    name="productId"
                    type="number"
                    required
                    value={manualOrder.productId || ""}
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
                    value={manualOrder.quantity || ""}
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
                    value={manualOrder.totalCost || ""}
                    onChange={handleManualOrderChange}
                    placeholder="Enter total cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesType">Sales Type</Label>
                  <Select
                    value={manualOrder.salesType}
                    onValueChange={(value: string) =>
                      setManualOrder((prev) => ({
                        ...prev,
                        salesType: value,
                      }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sales type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sales Type</SelectLabel>
                        <SelectItem value="Direct - B2B">
                          Direct - B2B
                        </SelectItem>
                        <SelectItem value="Direct - B2C">
                          Direct - B2C
                        </SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Consignment">Consignment</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesDate">Sales Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !manualOrder.salesDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        <span>{manualOrder.salesDate}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          manualOrder.salesDate
                            ? new Date(manualOrder.salesDate)
                            : undefined
                        }
                        onSelect={(date) =>
                          setManualOrder((current) => ({
                            ...current,
                            salesDate: date
                              ? new Date(
                                  Date.UTC(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate()
                                  )
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : "",
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700"
              >
                Create Order
              </Button>
              {orderStatus && (
                <div
                  className={`mt-2 p-2 rounded ${
                    orderStatus.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {orderStatus.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-lg font-medium mb-3">
              CSV Upload Instructions
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>What you can do:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Upload multiple CSV files at once, using Ctrl or Shift to
                  select multiple files.
                </li>
                <li>View upload status for each file</li>
                <li>Clear the upload history</li>
              </ul>

              <p className="mt-4">
                <strong>CSV File Requirements:</strong>
              </p>
              <p className="mt-2">
                <strong>Standard CSV Format:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Required columns:
                  <ul className="list-[circle] pl-5 mt-1">
                    <li>Row No.</li>
                    <li>
                      Sale Date (format: DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD)
                    </li>
                    <li>Sale Type</li>
                    <li>Digital (Online - Website/Offline)</li>
                    <li>Customer ID (numeric)</li>
                    <li>Zip Code (optional)</li>
                    <li>Shipping Method</li>
                    <li>Product Name</li>
                    <li>Product Variant</li>
                    <li>Quantity (numeric)</li>
                    <li>Price (numeric)</li>
                    <li>Product Price (numeric)</li>
                  </ul>
                </li>
              </ul>

              <p className="mt-2">
                <strong>Customer Names CSV Format:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Required columns:
                  <ul className="list-[circle] pl-5 mt-1">
                    <li>Row No.</li>
                    <li>
                      Sale Date (format: DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD)
                    </li>
                    <li>Sale Type</li>
                    <li>Digital (Online - Website/Offline)</li>
                    <li>Customer ID (numeric)</li>
                    <li>First Name</li>
                    <li>Last Name</li>
                    <li>Zip Code (optional)</li>
                    <li>Shipping Method</li>
                    <li>Product Name</li>
                    <li>Product Variant</li>
                    <li>Quantity (numeric)</li>
                    <li>Price (numeric)</li>
                    <li>Product Price (numeric)</li>
                  </ul>
                </li>
              </ul>

              <p className="mt-4">
                <strong>General Requirements:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Files must be in CSV format (.csv extension)</li>
                <li>First row should contain column headers</li>
                <li>All numeric fields should contain valid numbers</li>
                <li>
                  For new customers, only Customer ID is required (other fields
                  are optional)
                </li>
                <li>
                  For existing customers, any provided fields will update their
                  record
                </li>
              </ul>

              <p className="mt-4">
                <strong>Important Notes:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Please remain on this page while files are being uploaded
                </li>
                <li>Files are processed one at a time</li>
                <li>Large files may take longer to process</li>
                <li>
                  If you encounter errors, check the file format and try again
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Standard CSV Upload Card */}
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard CSV Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Input
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100 h-full file:cursor-pointer border-0 shadow-none"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload standard format CSV files here.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-green-800 hover:bg-green-700"
                >
                  {uploading ? "Uploading..." : "Upload Standard CSV Files"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Customer Names CSV Upload Card */}
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Names CSV Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomerNamesSubmit}>
                <div className="mb-4">
                  <Input
                    id="customerNamesFileInput"
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleCustomerNameFileChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 h-full file:cursor-pointer border-0 shadow-none"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload CSV files with customer names here.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-800 hover:bg-blue-700"
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload Customer Names CSV Files"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <Card className="mt-4">
            <CardContent className="pt-6">
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
                      record.status === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {record.filename || "Upload Attempt"}
                        </p>
                        <p
                          className={`text-sm ${
                            record.status === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
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
            </CardContent>
          </Card>
        )}
      </div>
    </motion.section>
  );
};

export default CsvUploadForm;
