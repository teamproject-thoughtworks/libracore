import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("ID");
    const name = localStorage.getItem("name");
    if (token && role && id) return { token, role, id, name };
  } catch {}
  return null;
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, role, id, name, email } = action.payload;
      state.user = { token, role, id, name, email };
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("ID", id);
      localStorage.setItem("name", name || "");
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("ID");
      localStorage.removeItem("name");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export default authSlice.reducer;
