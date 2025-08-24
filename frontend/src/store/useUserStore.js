import { create } from 'zustand';
import axios from "axios";

const BASE_URL = "http://localhost:3000"

export const useUserStore = create((set, get) => ({
  // users state
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/users/`);
      set({ users: response.data.data, error: null });
    } catch (error) {
        if (error.response?.status === 429) {
        set({ error: "Rate Limit Exceeded" });
        } else {
        set({ error: error.message || "Failed to fetch users" });
        }
    } finally {
      set({ loading: false });
    }
  }
}));
