// app/components/LoginForm.tsx
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import Image from "next/image";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use axios to send a POST request to the backend for user login
      const response = await axios.post(
        "http://localhost:8080/api/employee/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        // Save JWT token or session identifier if returned by the backend
        Cookies.set("role", response.data.role, { expires: 1 }); // Set role with 1-day expiration
        Cookies.set("username", response.data.username, { expires: 1 }); // Set username with 1-day expiration
        console.log(response.data.role, response.data.username);
        if (response.data.role === "ADMIN") {
          router.push("/admin");
        }
        router.push("/dashboard"); // Redirect to the dashboard after successful login
      } else {
        console.error("Failed to log in user");
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data;

          if (status === 403) {
            alert("User account is suspended. Please contact admin.");
          } else if (status === 401) {
            alert("Invalid username or password");
          } else {
            alert("An unexpected error occurred. Please try again.");
          }
        } else {
          alert("Unable to connect to server. Please try again later.");
        }
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className=" text-xl font-bold text-green-800">
            <Image
              width="150"
              height="100"
              src="/images/logo.png"
              alt="Logo"
              className="mx-auto"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-green-800 hover:bg-green-900"
            >
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default LoginForm;
