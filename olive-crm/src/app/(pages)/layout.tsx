"use client";
import SideBar from "@/components/sideBar";
import "@/app/globals.css";
import ProtectedLayout from "@/app/protected-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <div className="flex h-screen bg-gray-100 w-full">
        <SideBar />
        <div className="flex-grow overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
