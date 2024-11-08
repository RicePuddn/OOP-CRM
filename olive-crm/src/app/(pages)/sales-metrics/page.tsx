"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SalesMetrics from "@/components/salesMetrics";

export default function SalesMetricsPage() {
    const router = useRouter();

    useEffect(() => {
        const role = Cookies.get("role");
        if (role !== "SALES") {
            router.push("/dashboard"); // Redirect non-SALES users to dashboard
        }
    }, [router]);

    return <SalesMetrics />;
}
