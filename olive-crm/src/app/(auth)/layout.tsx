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
                width: "100%",
            }}
        >
            <video
                autoPlay
                muted
                loop
                playsInline
                id="myVideo"
                style={{
                    position: "absolute",
                }}
            >
                <source
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    src="https://cdn.shopify.com/videos/c/o/v/1d15a67c83a6441292e0b8229fea9ade.mp4"
                    type="video/mp4"
                />
            </video>
            <div
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
                style={{
                    position: "fixed",
                    background: "rgba(0, 0, 0, 0.5)",
                    width: "100%",
                    padding: "20px",
                }}
            >
                {children}
            </div>
        </div>
    );
}
