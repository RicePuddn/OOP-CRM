"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Download,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  password?: string;
}

type ViewMode = "table" | "grid";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    role: "SALES",
  });
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employee");
      const fetchedUsers = response.data.map((user: User) => ({
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        password: user.password,
      }));
      setUsers(fetchedUsers);
      setOriginalUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleCreate = () => {
    setGeneratedPassword(generatePassword());
    setShowCreateModal(true);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleEdit = (id: number) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setEditedUser({ ...userToEdit, password: "" });
      setShowEditModal(true);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    try {
      const confirmDelete = confirm(
        `Are you sure you want to delete user '${username}'?`
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:8080/api/employee/delete/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } else {
        console.log(`User '${id}' not deleted`); // User canceled
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (!sortConfig) return 0;
      const key = sortConfig.key;
      if (a[key] && b[key] && a[key] < b[key]) {
        return sortConfig?.direction === "asc" ? -1 : 1;
      }
      if (a[key] && b[key] && a[key] > b[key]) {
        return sortConfig?.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setUsers(sortedUsers);
  };

  const filterUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    if (!searchQuery) {
      setUsers(originalUsers);
    } else {
      const filteredUsers = originalUsers.filter((user) => {
        return (
          user.username?.toLowerCase().includes(searchQuery) ||
          user.first_name?.toLowerCase().includes(searchQuery) ||
          user.last_name?.toLowerCase().includes(searchQuery) ||
          user.role?.toLowerCase().includes(searchQuery)
        );
      });
      setUsers(filteredUsers);
    }
  };

  const handleExport = () => {
    // Define CSV headers
    const headers = ["ID", "Username", "First Name", "Last Name", "Role"];

    // Convert users data to CSV format
    const userDataCsv = users.map((user) => [
      user.id,
      user.username,
      user.first_name,
      user.last_name,
      user.role,
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...userDataCsv.map((row) => row.join(",")),
    ].join("\n");

    // Create Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    // Create download URL
    const url = window.URL.createObjectURL(blob);
    link.setAttribute("href", url);

    // Set filename with current date
    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `users_${date}.csv`);

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
      <div className="flex flex-col h-screen bg-gray-100 w-full">
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Card className="bg-white p-2 rounded shadow-2xl w-full max-w-md border-green-700 border-4">
              <CardHeader className="text-gray-700 text-2xl font-bold">
                Create New User
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await axios.post(
                        "http://localhost:8080/api/employee/create",
                        {
                          username: newUser.username,
                          first_name: newUser.first_name,
                          last_name: newUser.last_name,
                          role: newUser.role,
                          password: generatedPassword,
                        }
                      );
                      fetchUsers();
                      setShowCreateModal(false);
                      setGeneratedPassword("");
                      setNewUser({
                        username: "",
                        first_name: "",
                        last_name: "",
                        role: "SALES",
                      });
                    } catch (error) {
                      console.error("Failed to create user", error);
                    }
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      className="mt-1 p-2 block w-full border rounded text-gray-700 bg-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      type="text"
                      value={newUser.first_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, first_name: e.target.value })
                      }
                      className="mt-1 p-2 block w-full border rounded text-gray-700 bg-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      value={newUser.last_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, last_name: e.target.value })
                      }
                      className="mt-1 p-2 block w-full border rounded text-gray-700 bg-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <Select
                      onValueChange={(value: string) =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="SALES">Sales</SelectItem>
                          <SelectItem value="MARKETING">MARKETING</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Generated Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={generatedPassword}
                        onChange={(e) => setGeneratedPassword(e.target.value)}
                        className="mt-1 p-2 block w-full border rounded text-gray-700 bg-white"
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        {showEditModal && editedUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Card className="bg-white p-2 rounded shadow-2xl w-full max-w-md border-green-700 border-4">
              <CardHeader className="text-gray-700 text-2xl font-bold">
                Edit User
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await axios.put(
                        `http://localhost:8080/api/employee/update/${editedUser.id}`,
                        {
                          username: editedUser.username,
                          first_name: editedUser.first_name,
                          last_name: editedUser.last_name,
                          role: editedUser.role,
                          password: editedUser.password,
                        }
                      );

                      fetchUsers();
                      setShowEditModal(false);
                      setEditedUser(null);
                    } catch (error) {
                      console.error("Failed to update user", error);
                    }
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          username: e.target.value,
                        })
                      }
                      className="text-gray-700 mt-1 p-2 block w-full border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      type="text"
                      value={editedUser.first_name}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          first_name: e.target.value,
                        })
                      }
                      className="text-gray-700 mt-1 p-2 block w-full border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      value={editedUser.last_name}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          last_name: e.target.value,
                        })
                      }
                      className="text-gray-700 mt-1 p-2 block w-full border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <Select
                      onValueChange={(value: string) =>
                        setEditedUser({ ...editedUser, role: value })
                      }
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder={editedUser.role} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="SALES">SALES</SelectItem>
                          <SelectItem value="MARKETING">MARKETING</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      New Password (optional)
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        // value={editedUser.password || ''}
                        value={
                          editedUser.password !== undefined
                            ? editedUser.password
                            : ""
                        }
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter new password to reset"
                        className="text-gray-700 mt-1 p-2 block w-full border rounded"
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="flex-grow overflow-hidden w-full px-4 sm:px-6 py-4 sm:py-8">
          <div className="mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-gray-700 text-2xl sm:text-3xl font-medium">
                User Management
              </h3>
              <div className="flex w-full sm:w-auto gap-2">
                <div className="flex rounded-md border border-gray-300 p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={`p-2 ${
                      viewMode === "table"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="flex-1 sm:flex-initial items-center gap-2 text-gray-600 border border-gray-300 
                          hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 
                          group transition-all duration-200 h-30"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Export
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 sm:flex-initial bg-green-800 hover:bg-green-700 text-white 
                          px-4 py-2 rounded-md flex items-center justify-center gap-2 h-30"
                >
                  <span className="text-lg">+</span>
                  Create New User
                </Button>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Username, First Name, Last Name, or Role"
                    onChange={filterUsers}
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                  />
                </div>
                <Select
                  defaultValue="All"
                  onValueChange={(value: string) => {
                    if (value === "All") {
                      setUsers(originalUsers);
                    } else {
                      const filtered = originalUsers.filter(
                        (user) => user.role === value
                      );
                      setUsers(filtered);
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[100px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="SALES">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                {viewMode === "table" ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-y border-gray-200">
                        <th
                          className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("username")}
                        >
                          Username{" "}
                          {sortConfig?.key === "username"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("first_name")}
                        >
                          First Name{" "}
                          {sortConfig?.key === "first_name"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("last_name")}
                        >
                          Last Name{" "}
                          {sortConfig?.key === "last_name"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("role")}
                        >
                          Role{" "}
                          {sortConfig?.key === "role"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.first_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "MARKETING"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role !== "ADMIN" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(user.id)}
                                  >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDelete(user.id, user.username)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  // Grid view
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              @{user.username}
                            </p>
                          </div>
                          {user.role !== "ADMIN" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(user.id)}
                                >
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDelete(user.id, user.username)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "MARKETING"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UserManagementPage;
