// Sidebar.tsx
"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Menu,
  ChevronDown,
  LogOut,
  Newspaper,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const username = Cookies.get("username");
  const role = Cookies.get("role");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Close sidebar when screen size becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("username");
    router.push("/"); // Redirect to login page
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="w-full mx-auto px-5">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <span className="text-3xl font-bold text-green-800">
                Olive CRM
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base  font-medium flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Orders
                </Link>
                <Link
                  href="/csv-upload"
                  className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  CSV Upload
                </Link>
                <Link
                  href="/reports"
                  className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <BarChart className="h-4 w-4 mr-1" />
                  Reports
                </Link>
                {role === "MARKETING" && (
                  <Link
                    href="/newsletter"
                    className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <Newspaper className="h-4 w-4 mr-1" />
                    Newsletter
                  </Link>
                )}
                {role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="ml-1 bg-green-800 hover:bg-green-700 hover:text-gray-200 h-10 w-fit"
                >
                  {username} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Customers
            </Link>
            <Link
              href="/orders"
              className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Orders
            </Link>
            <Link
              href="/csv-upload"
              className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              CSV Upload
            </Link>
            <Link
              href="/reports"
              className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Reports
            </Link>
            {role === "MARKETING" && (
              <Link
                href="/newsletter"
                className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              >
                Newsletter
              </Link>
            )}
            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              >
                Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="w-full">
                  {username} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </nav>
  );
}
