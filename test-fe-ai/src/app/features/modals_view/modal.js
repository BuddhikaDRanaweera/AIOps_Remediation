import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newRemediation: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setNewRemediation: (state, action) => {
      state.newRemediation = action.payload;
    },
  },
});

export const { setNewRemediation } = modalSlice.actions;
export default modalSlice.reducer;
