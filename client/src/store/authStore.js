// zustand is used for statemanagement
import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
// Authentication store
export const useAuthStore = create((set) => ({
  // initial state
  user: null,
  isAuthentication: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  // actions
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      // response
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthentication: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error in signin up",
        isLoading: false,
      });
      throw error;
    }
  },
  //   verify OTP
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/verify-email", { code });
      set({
        user: response.data.user,
        isAuthentication: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error in signin up",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    // await new Promise ((resolve)=>setTimeout(resolve,2000));
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get("/api/auth/check-auth");
      set({
        user: response.data.user,
        isAuthentication: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthentication: false,
      });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`/api/auth/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`/api/auth/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
  forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/api/auth/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
  resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
