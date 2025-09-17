"use client";

import { productApi } from "@/app/lib/api/products";
import { useState, useEffect } from "react";


export default function ProductEditForm({ product, onUpdated, onClose }:any) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setQuantity(product.quantity);
    
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productApi.update(product.id, { name, description, price, quantity });
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <h2 className="text-lg font-semibold">Edit Product</h2>
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
        <label className="block text-sm">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(Number(e.target.value))}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
