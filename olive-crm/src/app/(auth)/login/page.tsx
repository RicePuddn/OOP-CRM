"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoginComponent from "@/components/loginForm";

export default function SalesMetricsPage() {
  const router = useRouter();
  const role = Cookies.get("role");

  useEffect(() => {
    if (role) {
      router.push("/dashboard");
    }
  }, [role, router]);

  if (role) {
    return null;
  }

  return (
    <div
      className="flex w-full h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/images/background1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <LoginComponent />
      </div>
    </div>
  );
}
