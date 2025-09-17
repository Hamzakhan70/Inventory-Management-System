import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ordersApi = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data.data.data;
  },
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/orders/${id}`);
    return res.data.data;
  },
  updateStatus: async (id, status) => {
    const res = await axios.put(`${API_URL}/orders/${id}`, { status });
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/orders/${id}`);
    return res.data;
  },
};
