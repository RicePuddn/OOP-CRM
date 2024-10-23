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
        <main className="flex h-[100dvh] max-h-[100dvh] max-w-full flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
          <SidebarTrigger />
          <div className="h-full max-h-full overflow-y-scroll rounded-md border-2">
            <div className="text-black">{children}</div>
          </div>
        </main>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
