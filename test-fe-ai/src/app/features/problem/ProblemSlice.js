import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  problemTitle: null,
  subProblemTitle: null,
  problemId: null,
  serviceName: null,
};

const ProblemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setProblem: (state, action) => {
      state.problemTitle = action.payload.problemTitle;
      state.subProblemTitle = action.payload.subProblemTitle;
      state.problemId = action.payload.problemId;
      state.serviceName = action.payload.serviceName;
    },

    clearProblem: (state) => {
      state.problemTitle = null;
      state.subProblemTitle = null;
      state.problemId = null;
      state.serviceName = null;
    },
  },
});

export const { setProblem, clearProblem } = ProblemSlice.actions;

export default ProblemSlice.reducer;
