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
      set({
        error:
          err.response?.data?.message || err.message || "Failed to fetch users",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Create a new user
  createUser: async (formData) => {
    set({ loading: true, error: null });
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      const res = await axios.post(`${BASE_URL}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refetch users to ensure state consistency and avoid duplicates
      await get().fetchUsers();
      return res.data.data;
    } catch (err) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to create user",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  // Update user role
  updateUserRole: async (userId, role) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${BASE_URL}/${userId}`, { role });
      set((state) => ({
        users: state.users.map((u) =>
          u.user_id === userId ? res.data.data : u
        ),
        error: null,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },
  // Update user role
  updateUserApproval: async (userId, isApproved) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${BASE_URL}/${userId}`, {
        is_approved: isApproved,
      });
      set((state) => ({
        users: state.users.map((u) =>
          u.user_id === userId ? res.data.data : u
        ),
        error: null,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
