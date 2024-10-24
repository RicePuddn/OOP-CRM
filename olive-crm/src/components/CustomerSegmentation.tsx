"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ChartData, ChartOptions } from 'chart.js';

// Register Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DynamicPie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });

interface CustomerSegment {
  customerIds: number[];
  segmentType: string;
  segmentCategory: string;
}

export default function CustomerSegmentation() {
  const [segments, setSegments] = useState<Record<string, CustomerSegment>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Recency' | 'Frequency' | 'Monetary'>('Recency');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllSegments();
  }, []);

  const fetchAllSegments = async () => {
    setLoading(true);
    setError(null);
    try {
      const recencySegments = await Promise.all([
        fetch('http://localhost:8080/api/orders/segments/recency/active').then(res => res.json()),
        fetch('http://localhost:8080/api/orders/segments/recency/dormant').then(res => res.json()),
        fetch('http://localhost:8080/api/orders/segments/recency/returning').then(res => res.json())
      ]);

      const frequencySegments = await Promise.all([
        fetch('http://localhost:8080/api/orders/segments/frequency/frequent').then(res => res.json()),
        fetch('http://localhost:8080/api/orders/segments/frequency/occasional').then(res => res.json()),
        fetch('http://localhost:8080/api/orders/segments/frequency/one-time').then(res => res.json())
      ]);

      const monetarySegments = await fetch('http://localhost:8080/api/orders/segments/monetary').then(res => res.json());

      const allSegments: Record<string, CustomerSegment> = {};
      
      // Process recency segments
      ['Active', 'Dormant', 'Returning'].forEach((type, index) => {
        allSegments[type] = recencySegments[index];
      });

      // Process frequency segments
      ['Frequent', 'Occasional', 'One-time'].forEach((type, index) => {
        allSegments[type] = frequencySegments[index];
      });

      // Process monetary segments
      monetarySegments.forEach((segment: CustomerSegment) => {
        allSegments[segment.segmentType] = segment;
      });

      console.log('Fetched segments:', allSegments); // Debug log
      setSegments(allSegments);
    } catch (error) {
      console.error('Error fetching segments:', error);
      setError('Failed to fetch customer segments');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (category: 'Recency' | 'Frequency' | 'Monetary'): ChartData<'pie'> => {
    const categorySegments = Object.entries(segments).filter(([_, segment]) => 
      segment.segmentCategory === category
    );

    console.log(`Segments for ${category}:`, categorySegments); // Debug log

    const labels = categorySegments.map(([type]) => type);
    const data = categorySegments.map(([_, segment]) => segment.customerIds.length);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const renderSegmentList = (category: 'Recency' | 'Frequency' | 'Monetary') => {
    const categorySegments = Object.entries(segments).filter(([_, segment]) => 
      segment.segmentCategory === category
    );

    return (
      <div className="mt-4 grid grid-cols-1 gap-4">
        {categorySegments.map(([type, segment]) => (
          <div key={type} className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-2 text-black">{type}</h4>
            <p className="text-black">
              Number of customers: {segment.customerIds.length}
            </p>
            <div className="mt-2">
              <details>
                <summary className="cursor-pointer text-blue-500">View Customer IDs</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded text-black">
                  {segment.customerIds.join(', ')}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'Recency', label: 'Recency Analysis' },
    { id: 'Frequency', label: 'Frequency Analysis' },
    { id: 'Monetary', label: 'Monetary Analysis' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-black">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">Customer Segmentation Analysis</h2>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'Recency' | 'Frequency' | 'Monetary')}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-black hover:text-gray-900 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">Distribution Chart</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <div style={{ height: '300px' }}>
              {typeof window !== 'undefined' && (
                <DynamicPie
                  data={getChartData(activeTab)}
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">Segment Details</h3>
          {renderSegmentList(activeTab)}
        </div>
      </div>
    </div>
  );
}
