import { createSlice } from "@reduxjs/toolkit";
import { logout, register, login, fetchProfile, updateProfile } from "../services/auth-thunks";

const loadCurrentUser = () => {
  const savedState = localStorage.getItem("currentUser");
  return savedState ? JSON.parse(savedState) : null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: { currentUser: loadCurrentUser() },
  reducers: {},
  extraReducers: {
    [register.fulfilled]: (state, { payload }) => {
      console.log("Register Paylod: ", payload);
      state.currentUser = payload;
      localStorage.setItem("currentUser", JSON.stringify(payload));
    },
    [logout.fulfilled]: (state) => {
      console.log(state.currentUser);
      state.currentUser = null;
      localStorage.setItem("currentUser", JSON.stringify(null));
    },
    [login.fulfilled]: (state, { payload }) => {
      console.log("Login Paylod: ", payload);
      state.currentUser = payload.user;
      console.log("Current User: ", state.currentUser);
      localStorage.setItem("currentUser", JSON.stringify(payload.user));
    },
    [fetchProfile.fulfilled]: (state, { payload }) => {
      console.log("Get Profile payload: ", payload);
      state.viewedProfile = payload;
    },
    [updateProfile.fulfilled]: (state, { payload }) => {
      console.log("Update Profile payload: ", payload);
      state.currentUser = payload;
      localStorage.setItem("currentUser", JSON.stringify(payload));
    },
  },
});

export default authSlice.reducer;
