import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alert: null,
  variant: null,
  open: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.alert = action.payload.alert;
      state.variant = action.payload.variant;
      state.open = action.payload.open;
    },
    clearAlert: (state, action) => {
      state.alert = null;
      state.open = false;
      state.variant = null;
    },
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
