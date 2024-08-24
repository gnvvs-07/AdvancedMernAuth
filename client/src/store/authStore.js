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
}));
