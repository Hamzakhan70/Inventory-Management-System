import axiosInstance from "@/app/lib/axiosInstance";

export const productApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/products");
    
    return res.data.data.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  },
};
