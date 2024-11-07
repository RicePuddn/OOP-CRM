"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DashboardPage from "@/components/dashBoard";

export default function dashboard() {
  const router = useRouter();
  const role = Cookies.get("role");

  useEffect(() => {
    if (!role) {
      router.push("/login");
    }
    if (role === "ADMIN") {
      router.push("/admin");
    }
  }, [role, router]);

  if (!role || role === "ADMIN") {
    return null;
  }

  return <DashboardPage />;
}
