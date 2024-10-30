import DashboardPage from "@/components/dashBoard";
import CustomerHeatmap from "@/components/CustomerHeatMap";

export default function dashboard() {
  return (
    <div className="flex flex-col w-full h-screen p-4 bg-gray-100">
      {/* Top half: Customer Cluster Map */}
      <div className="w-full h-1/2 p-2">
        <CustomerHeatmap />
      </div>

      {/* Bottom half: Customer Data Component */}
      <div className="w-full h-1/2 p-2 mt-4">
        <DashboardPage />
      </div>
    </div>
  );
}
