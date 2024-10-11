"use client";
import { Users, ShoppingCart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const username = Cookies.get("username");
  return (
    <div className="w-full px-6 py-8 mt-10">
      <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,274</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$534.32</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,537,234</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <h3 className="mt-6 text-xl text-gray-700">Recent Orders</h3>
      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#1234</TableCell>
              <TableCell>John Smith</TableCell>
              <TableCell>Extra Virgin Olive Oil</TableCell>
              <TableCell>$59.99</TableCell>
              <TableCell>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#1235</TableCell>
              <TableCell>Jane Doe</TableCell>
              <TableCell>Organic Olive Oil</TableCell>
              <TableCell>$45.99</TableCell>
              <TableCell>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#1236</TableCell>
              <TableCell>Bob Johnson</TableCell>
              <TableCell>Infused Olive Oil Set</TableCell>
              <TableCell>$89.99</TableCell>
              <TableCell>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Processing
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Low Stock Alert */}
      <h3 className="mt-6 text-xl text-gray-700">Low Stock Alert</h3>
      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                Extra Virgin Olive Oil (500ml)
              </TableCell>
              <TableCell>15</TableCell>
              <TableCell>20</TableCell>
              <TableCell>
                <Button size="sm">Reorder</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Organic Olive Oil (750ml)
              </TableCell>
              <TableCell>8</TableCell>
              <TableCell>15</TableCell>
              <TableCell>
                <Button size="sm">Reorder</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
