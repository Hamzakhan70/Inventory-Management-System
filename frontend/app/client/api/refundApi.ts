import axiosInstance from "@/app/lib/axiosInstance";

export const refundApi = {
  requestRefund: async (paymentId: number, reason?: string) => {
    const res = await axiosInstance.post(`/refunds`, { paymentId, reason });
    return res.data;
  },
  getRefunds: async () => {
    const res = await axiosInstance.get(`/refunds`);
    
    return res.data.data;
  },
};