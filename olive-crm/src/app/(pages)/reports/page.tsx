"use client";
import CustomerSegmentation from "../../../components/CustomerSegmentation";

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="flex-grow overflow-auto">
        <div className="h-full w-full px-6 py-8 flex flex-col">
          <h3 className="text-black text-3xl font-medium mb-6">Reports</h3>
          <CustomerSegmentation />
        </div>
      </div>
    </div>
  );
}
