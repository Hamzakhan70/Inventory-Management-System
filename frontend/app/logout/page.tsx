"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        if (typeof window !== "undefined") localStorage.removeItem("token");
        await axiosInstance.post("/auth/logout");
      } catch {
        // ignore
      } finally {
        router.replace("/login");
      }
    };
    doLogout();
  }, [router]);

  return null;
} 