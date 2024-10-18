"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import axios from "axios";

const CsvUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file");
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus("File uploaded successfully");
      } else {
        setUploadStatus("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium">Update Orders</h3>
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
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              />
            </div>
            <Button
              type="submit"
              disabled={uploading}
              className="bg-green-800 hover:bg-green-700"
            >
              {uploading ? "Uploading..." : "Upload CSV"}
            </Button>
          </form>
          {uploadStatus && (
            <p
              className={`mt-4 ${
                uploadStatus.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {uploadStatus}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CsvUploadForm;
