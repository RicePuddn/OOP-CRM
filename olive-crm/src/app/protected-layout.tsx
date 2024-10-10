import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = Cookies.get("role");
    if (!role) {
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
