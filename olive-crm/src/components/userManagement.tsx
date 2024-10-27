"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  password?: string;
}

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', first_name: '', last_name: '', role: 'SALES' });
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
    const [showPassword, setShowPassword] = useState(true);
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
      setEditedUser({ ...userToEdit, password: '' });
      setShowEditModal(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/employee/delete/${id}`
      );
      setUsers(users.filter((user) => user.id !== id));
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

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full">
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h3 className="text-gray-700 text-lg font-medium mb-4">
              Create New User
            </h3>
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
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="mt-1 p-2 block w-full border rounded text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={newUser.first_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, first_name: e.target.value })
                  }
                  className="mt-1 p-2 block w-full border rounded text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newUser.last_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, last_name: e.target.value })
                  }
                  className="mt-1 p-2 block w-full border rounded text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="mt-1 p-2 block w-full border rounded text-gray-700"
                >
                  <option value="SALES">SALES</option>
                  <option value="MARKETING">MARKETING</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Generated Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    className="mt-1 p-2 block w-full border rounded text-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
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
          </div>
        </div>
      )}
      {showEditModal && editedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4 text-gray-700">
              Edit User
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                    await axios.put(`http://localhost:8080/api/employee/update/${editedUser.id}`, {
                        username: editedUser.username,
                        first_name: editedUser.first_name,
                        last_name: editedUser.last_name,
                        role: editedUser.role,
                        password: editedUser.password
                      });
                  
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
                <input
                  type="text"
                  value={editedUser.username}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, username: e.target.value })
                  }
                  className="text-gray-700 mt-1 p-2 block w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={editedUser.first_name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, first_name: e.target.value })
                  }
                  className="text-gray-700 mt-1 p-2 block w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editedUser.last_name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, last_name: e.target.value })
                  }
                  className="text-gray-700 mt-1 p-2 block w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={editedUser.role}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, role: e.target.value })
                  }
                  className="text-gray-700 mt-1 p-2 block w-full border rounded"
                >
                  <option value="SALES">SALES</option>
                  <option value="MARKETING">MARKETING</option>
                </select>
              </div>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  // value={editedUser.password || ''}
                  value={editedUser.password !== undefined ? editedUser.password : ''}
                  onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                  placeholder="Enter new password to reset"
                  className="text-gray-700 mt-1 p-2 block w-full border rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
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
          </div>
        </div>
      )}
      <div className="flex-grow overflow-hidden w-full px-6 py-8">
        <div className=" mx-auto h-full flex flex-col">
          <h3 className="text-gray-700 text-3xl font-medium">
            User Management
          </h3>
          <div className="flex-grow bg-white rounded-lg shadow overflow-hidden flex flex-col mt-4">
            <div className="overflow-x-auto flex-grow">
              <div className="p-4">
                <Button
                  onClick={handleCreate}
                  className="bg-green-800 hover:bg-green-700"
                >
                  Create New User
                </Button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      Role{" "}
                      {sortConfig?.key === "role"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
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
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          onClick={() => handleEdit(user.id)}
                          className="bg-green-800 hover:bg-green-700 mr-2"
                          disabled={user.role === "ADMIN"}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
                          className="bg-green-800 hover:bg-green-700"
                          disabled={user.role === "ADMIN"}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
