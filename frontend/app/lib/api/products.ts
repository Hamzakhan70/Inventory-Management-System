import axiosInstance from "@/app/lib/axiosInstance";

export const productApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/products");
     return res.data?.data.data;
  },
  create: async (data: { name: string; price: number; stock: number }) => {
    const res = await axiosInstance.post("/products", data);
    return res.data;
  },
  update: async (id: number, data: { name: string;description:string; quantity: number;price: number;}) => {
    const res = await axiosInstance.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },
};
