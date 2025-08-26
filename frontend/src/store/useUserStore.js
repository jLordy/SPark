import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/users";

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(BASE_URL);
      set({ users: response.data.data, error: null });
    } catch (err) {
      set({ error: err.message || "Failed to fetch users" });
    } finally {
      set({ loading: false });
    }
  },

  // Create a new user
  createUser: async (formData) => {
    set({ loading: true });
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

      const res = await axios.post(`${BASE_URL}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Optionally add the new user to the loyecal state
      set((state) => ({ users: [...state.users, res.data.data], error: null }));
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || "Failed to create user" });
      throw err; // re-throw if you want to handle in the component
    } finally {
      set({ loading: false });
    }
  },
}));
