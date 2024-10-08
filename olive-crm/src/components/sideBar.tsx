"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <>
      <div>
        {/* Toggle button for small screens */}
        <button
          className="fixed top-4 left-4 z-30 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6 mt-3 ml-2 text-green-800" />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-20 w-64 bg-white transform  ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto`}
        >
          <div className="sticky top-0 bg-white z-10">
            <div className="flex items-center justify-center h-20 border-b">
              <span className="text-2xl font-bold text-green-800">
                Olive CRM
              </span>
            </div>
          </div>
          <nav className="flex-grow">
            <Link
              href="/"
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
              href="/reports"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <BarChart className="h-5 w-5 mr-3" />
              Reports
            </Link>
            <Link
              href="/csv-upload"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Upload className="h-5 w-5 mr-3" />
              CSV Upload
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </nav>
        </div>
        <header className="fixed top-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b h-20 left-0 md:left-64">
          <div className="flex items-center w-7/12">
            <Input
              type="search"
              placeholder="Search..."
              className="ml-10 text-black "
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-2 text-black hover:text-slate-500"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
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
                  className="ml-4 bg-green-800 hover:bg-green-700 hover:text-gray-200 h-10"
                >
                  Mr Olive Man
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
    </>
  );
}
