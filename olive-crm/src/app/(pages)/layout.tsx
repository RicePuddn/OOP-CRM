"use client";
import NavigationBar from "@/components/sideBar";
import "@/app/globals.css";
import ProtectedLayout from "@/app/protected-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <div className="flex flex-col h-screen bg-gray-100 w-full">
        <NavigationBar />
        <div className="flex-grow overflow-auto">
          <div className="p-1">{children}</div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
