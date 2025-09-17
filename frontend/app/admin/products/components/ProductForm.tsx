"use client";

import { useState } from "react";
import { productApi } from "@/app/lib/api/products";
export default function ProductForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productApi.create({ name, price, stock });
      setName("");
      setPrice(0);
      setStock(0);
      onCreated(); // refresh product list
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <div>
        <label className="block text-sm">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="border px-2 py-1 w-full"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
