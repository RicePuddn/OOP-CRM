'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CsvUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('CSV file uploaded and processed successfully');
      } else {
        alert('Error uploading CSV file');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading CSV file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Upload CSV File</h1>
        <div className="space-y-4">
          <Input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
          />
          <Button 
            onClick={handleFileUpload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload
          </Button>
        </div>
        {file && (
          <p className="mt-4 text-sm text-gray-600">
            Selected file: {file.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default CsvUploadPage;
