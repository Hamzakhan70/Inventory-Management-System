import axiosInstance from "@/app/lib/axiosInstance";

export const orderApi = {
  createOrder: async (payload: {
    customerId: number; // in real app this will come from auth/session
    items: { productId: number; quantity: number; price: number }[];
  }) => {
    const res = await axiosInstance.post("/orders", payload);
    return res.data;
  },

  createStripeSession: async (orderId: number) => {
    
    const res = await axiosInstance.post(`/payments/stripe`, {
      orderId:orderId,
    });
    return res.data;
  },
};
