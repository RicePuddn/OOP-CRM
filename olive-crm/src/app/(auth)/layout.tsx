// app/login/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Login - Olive Oil CRM",
  description: "Login to access the Olive Oil CRM dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex w-full h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/images/background1.png')",
        backgroundSize: "cover", // Ensures the image covers the entire screen
        backgroundPosition: "center", // Centers the image
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
