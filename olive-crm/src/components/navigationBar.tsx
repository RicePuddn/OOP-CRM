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
  UserRoundCog,
  UsersRound,
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
import Image from "next/image";

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
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: Home,
    // },
    // {
    //   title: "Orders",
    //   url: "/orders",
    //   icon: ShoppingCart,
    // },
    // {
    //   title: "CSV Upload",
    //   url: "/csv-upload",
    //   icon: Upload,
    // },
    // {
    //   title: "Customers",
    //   url: "/customers",
    //   icon: UsersRound,
    // },
  ];
  if (role === "ADMIN") {
    items.push(
      {
        title: "Admin",
        url: "/admin",
        icon: UserRoundCog,
      },
      {
        title: "Newsletter",
        url: "/newsletter-admin",
        icon: Newspaper,
      }
    );
  } else if (role === "MARKETING") {
    items.push(
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
        title: "Upload",
        url: "/csv-upload",
        icon: Upload,
      },
      {
        title: "Customers",
        url: "/customers",
        icon: UsersRound,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart,
      },
      {
        title: "Newsletter",
        url: "/newsletter-marketing",
        icon: Newspaper,
      }
    );
  } else if (role === "SALES") {
    items.push(
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
        title: "Upload",
        url: "/csv-upload",
        icon: Upload,
      },
      {
        title: "Customers",
        url: "/customers",
        icon: UsersRound,
      },
      {
        title: "Sales Metrics",
        url: "/sales-metrics",
        icon: BarChart,
      }
    );
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <Image
          src="/images/logo.png"
          height="50"
          width="150"
          alt="logo"
          className="m-auto"
        />
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
                <SidebarMenuButton className="rounded bg-green-700 text-white hover:bg-green-600 hover:text-white">
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
                  className="cursor-pointer rounded bg-red-600 h-8 flex items-center mb-1 hover:bg-red-500 hover:text-white"
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
