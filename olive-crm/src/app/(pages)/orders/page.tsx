"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import OrdersPage from "@/components/ordersComponent";

export default function SalesMetricsPage() {
  const router = useRouter();
  const role = Cookies.get("role");

  useEffect(() => {
    if (!role || role === "ADMIN") {
      router.push("/dashboard");
    }
  }, [role, router]);

  if (!role || role === "ADMIN") {
    return null;
  }

  return <OrdersPage />;
}
