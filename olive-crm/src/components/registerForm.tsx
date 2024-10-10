// app/components/RegisterForm.tsx
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your registration logic here
    console.log({ username, email, password });
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/"); // Redirect to the login page
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-green-800">
          Register
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
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Register
          </Button>
          <Button
            className="w-full mt-4 bg-white text-black hover:bg-gray-300"
            onClick={handleLoginClick}
          >
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
