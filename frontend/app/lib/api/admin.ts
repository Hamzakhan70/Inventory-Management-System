import axiosInstance from "@/app/lib/axiosInstance";

export const adminApi = {
  async getDashboardStats() {
    const res = await axiosInstance.get("/admin/products/stats"); 
    return res.data;
  },
};
