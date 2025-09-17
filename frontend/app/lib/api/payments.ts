import axiosInstance from "@/app/lib/axiosInstance";

export const paymentsApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/payments");
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await axiosInstance.get(`/payments/${id}`);
    return res.data;
  },
};
