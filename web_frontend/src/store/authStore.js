import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

//const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";
const API_URL = import.meta.env.VITE_API + "/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
    isUpdatingPic: false,
	message: null,

	signup: async (lName, fName, pseudo, email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { lName, fName, pseudo, email, password });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
			toast.success(`Bon retour ${response.data.user.pseudo}`)
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verifyEmail`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/checkAuth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgotPassword`, { email });
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
			const response = await axios.post(`${API_URL}/resetPassword/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

    updatePic: async ({profilePic}) => {
        set({ isUpdatingPic: true });
        try {

        const res = await axios.put(`${API_URL}/updatePic`, { profilePic });
        set({ user: res.data.user });
          toast.success("La photo de profile à été mise à jour.");
        } catch (error) {
            console.log("error in update profile: ", error.response?.data || error.message || error);
            toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingPic: false });
        }
      },

	  updateProfile: async (updatePayload) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put(`${API_URL}/updateProfile`, updatePayload);
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({
				error: error.response?.data?.message || "Erreur lors de la mise à jour",
				isLoading: false,
			});
			throw error;
		}
	},
	
}));

