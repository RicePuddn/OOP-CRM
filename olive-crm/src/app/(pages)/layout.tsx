"use client";
import AppSidebar from "@/components/navigationBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "@/app/globals.css";
import ProtectedLayout from "@/app/protected-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
