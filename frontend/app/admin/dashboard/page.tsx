"use client";

import { useQuery } from "@tanstack/react-query";
import {adminApi} from "@/app/lib/api/admin";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: adminApi.getDashboardStats,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load stats</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-bold">Total Sales</h2>
        <p className="text-2xl font-semibold mt-2">${data.totalProducts}</p>
      </div>
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-bold">Orders</h2>
        <p className="text-2xl font-semibold mt-2">{data.totalProducts}</p>
      </div>
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-bold">Products</h2>
        <p className="text-2xl font-semibold mt-2">{data.totalProducts}</p>
      </div>
    </div>
  );
}
