import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, actiom) => {
      state.state = actiom.payload;
    },
  },
});

export const { setUserData, setCity, setState } = userSlice.actions;

export default userSlice.reducer;
