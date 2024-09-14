import type { Metadata } from "next";
import "@/app/globals.css";
import SideBar from "@/components/sideBar";

export const metadata: Metadata = {
  title: "Olive Oil CRM",
  description: "OLIVEOILOLIVEOILOLIVEOIL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
          <SideBar />
          <div className="flex-1 ml-0 md:ml-64 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
