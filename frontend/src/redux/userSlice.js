import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setcurrentState: (state, actiom) => {
      state.currentState = actiom.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
  },
});

export const {
  setUserData,
  setCurrentAddress,
  setcurrentState,
  setCurrentCity,
} = userSlice.actions;

export default userSlice.reducer;
