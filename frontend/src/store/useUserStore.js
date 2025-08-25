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
  },

  // create a new user
  createUser: async (newUser) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${BASE_URL}/api/users/`, newUser, {
        headers: { "Content-Type": "application/json" },
      });

      // Optionally update local state
      set((state) => ({
        users: [...state.users, response.data],
        error: null,
      }));

      return response.data; // useful for redirect or toast
    } catch (error) {
      set({ error: error.message || "Failed to create user" });
      throw error; // rethrow so UI can catch
    } finally {
      set({ loading: false });
    }
  },
}));
