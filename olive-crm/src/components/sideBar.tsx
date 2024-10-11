// Sidebar.tsx
"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Menu,
  Bell,
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
    <>
      {/* Toggle button for small screens */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6 mt-3 ml-2 text-green-800" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-20 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64`}
      >
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center justify-center h-20 border-b">
            <span className="text-2xl font-bold text-green-800">Olive CRM</span>
          </div>
        </div>
        <nav className="flex-grow">
          <Link
            href="/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/customers"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Users className="h-5 w-5 mr-3" />
            Customers
          </Link>
          <Link
            href="/orders"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5 mr-3" />
            Orders
          </Link>
          <Link
            href="/csv-upload"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Upload className="h-5 w-5 mr-3" />
            CSV Upload
          </Link>
          <Link
            href="/reports"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <BarChart className="h-5 w-5 mr-3" />
            Reports
          </Link>
          {role === "MARKETING" && (
            <Link
              href="/newsletter"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Newspaper className="h-5 w-5 mr-3" />
              Newsletter
            </Link>
          )}
          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5 mr-3" />
              Admin
            </Link>
          )}
        </nav>
      </div>

      {/* Header */}
      <header className="fixed top-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b h-20 left-0 md:left-64">
        <div className="flex items-center w-7/12"></div>
        <div className="flex items-center">
          <Button
            variant="default"
            size="icon"
            className="bg-green-800 hover:bg-green-700 hover:text-gray-200 h-10"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="ml-1 bg-green-800 hover:bg-green-700 hover:text-gray-200 h-10 w-fit"
              >
                {username}
                <ChevronDown className="ml-2 h-4 w-4" />
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
      </header>
    </>
  );
}
