"use client";

import { useEffect, useState } from "react";

import ProductForm from "./components/ProductForm";
import { productApi } from "@/app/lib/api/products";
import ProductEditForm from "./components/ProductEditForm";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [editingProduct, setEditingProduct] = useState(null);
  const fetchProducts = () => {
    setLoading(true);
    productApi.getAll()
      .then(setProducts)
      .finally(() => setLoading(false));
  };
const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this product?")) return;
  await productApi.delete(id);
  fetchProducts(); // refresh list
};

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="p-4">Loading products...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Add Product Form */}
      <div className="mb-6">
        <ProductForm onCreated={fetchProducts} />
      </div>

      {/* Product List */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">${p.description}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.quantity}</td>
              <td className="border p-2 flex justify-center">
               <button
                  onClick={() => setEditingProduct(p)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
              <button
  onClick={() => handleDelete(p.id)}
  className="px-2 py-1 bg-red-500 text-white rounded"
>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <ProductEditForm
            product={editingProduct}
            onUpdated={fetchProducts}
            onClose={() => setEditingProduct(null)}
          />
        </div>
      )}
    </div>
  );
}
