// app/dashboard/layout.tsx
import SideBar from "@/components/sideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 w-full">
      <SideBar />
      <div className="flex-grow overflow-hidden">
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
