import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.loading = action.payload.loading;
    },
    clearGlobalLoading: (state, action) => {
      state.loading = false;
    },
  },
});

export const { setGlobalLoading, clearGlobalLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
