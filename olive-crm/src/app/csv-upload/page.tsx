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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload CSV File</h1>
      <div className="flex items-center space-x-2">
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleFileUpload}>Upload</Button>
      </div>
    </div>
  );
};

export default CsvUploadPage;