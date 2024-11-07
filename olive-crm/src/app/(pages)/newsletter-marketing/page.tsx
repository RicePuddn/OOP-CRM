"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import NewsletterPage from "@/components/newsletterMarketing";

export default function NewsletterMarketing() {
  const router = useRouter();
  const role = Cookies.get("role");

  useEffect(() => {
    if (!role || role !== "MARKETING") {
      router.push("/dashboard");
    }
    if (role === "ADMIN") {
      router.push("/admin");
    }
  }, [role, router]);

  if (!role || role !== "MARKETING") {
    return null;
  }
  return <NewsletterPage />;
}
