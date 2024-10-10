// app/protected-layout.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("role");
    if (!token) {
      router.push("/"); // Redirect to login page if not logged in
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return null; // Prevent rendering until authentication status is determined
  }

  return <>{children}</>;
}
