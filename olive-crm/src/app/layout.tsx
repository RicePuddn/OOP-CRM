// app/layout.tsx
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="flex h-screen bg-gray-100 w-full">
                    {children}
                </div>
                <Toaster />
            </body>
        </html>
    );
}
