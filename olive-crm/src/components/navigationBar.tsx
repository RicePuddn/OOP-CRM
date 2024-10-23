"use client";
import {
  BarChart,
  ChevronUp,
  Home,
  LogOut,
  Newspaper,
  ShoppingCart,
  Upload,
  User2,
  UserCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const username = Cookies.get("username");
  const role = Cookies.get("role");
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("role");
    router.push("/");
  };
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "CSV Upload",
      url: "/csv-upload",
      icon: Upload,
    },
  ];
  if (role === "ADMIN") {
    items.push(
      {
        title: "Newsletter",
        url: "/newsletter",
        icon: Newspaper,
      },
      {
        title: "Admin",
        url: "/admin",
        icon: UserCog,
      }
    );
  } else if (role === "MARKETING") {
    items.push({
      title: "Reports",
      url: "/reports",
      icon: BarChart,
    });
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-green-700 text-3xl font-semibold text-center cursor-default">
          Olive CRM
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded bg-red-400 h-8 flex items-center"
                >
                  <span className="text-white">
                    <LogOut className="mx-2 h-4 w-4 inline" />
                    Log out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
