"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CustomerTopProducts from "@/components/customerComponent";

export default function CustomerPage() {
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
  return <CustomerTopProducts />;
}
