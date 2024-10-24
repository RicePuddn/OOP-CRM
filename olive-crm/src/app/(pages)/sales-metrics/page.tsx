"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SalesMetrics from "@/components/salesMetrics";

export default function SalesMetricsPage() {
  const router = useRouter();
  const role = Cookies.get("role");

  useEffect(() => {
    if (!role || role !== "SALES") {
      router.push("/dashboard");
    }
  }, [role, router]);

  if (!role || role !== "SALES") {
    return null;
  }

  return <SalesMetrics />;
}
