import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import BASE_URL from "../../utils/config";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

if (initialState.token) {
  initialState.user = jwtDecode(initialState.token);
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.user = jwtDecode(action.payload);
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const loginUser = async (email, password, dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    dispatch(loginSuccess(res.data.token));
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const googleLogin = async (token, dispatch) => {
  try {
    dispatch(loginSuccess(token));
  } catch (error) {
    console.error("Google Login failed:", error);
  }
};

export default authSlice.reducer;
