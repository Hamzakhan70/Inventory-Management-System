import axiosInstance from "../utils/axiosInstance";

class AuthApi {
  async login(email, password) {
    const res = await axiosInstance.post("/auth/admin/login", { email, password });
    return res.data;
  }
}

export const authApi = new AuthApi();
