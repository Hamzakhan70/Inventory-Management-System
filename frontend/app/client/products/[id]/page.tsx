"use client";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {productApi} from "../../api/clientProduct.js";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export default function ProductDetailsPage() {
  const { id } = useParams(); // ✅ catch dynamic route param
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
const { addToCart } = useCart();
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(Number(id));
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading product...</p>;
  if (!product) return <p className="text-center py-10">Product not found.</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-2xl mx-auto border rounded-lg p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-2">
          Price: ${product.price}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Stock available: {product.quantity}
        </p>

     <button
  onClick={() =>
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
  }
  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
>
  Add to Cart
</button>
      </div>
    </div>
  );
}
