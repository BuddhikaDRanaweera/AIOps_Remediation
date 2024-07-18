import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  problemTitle: "",
  subProblemTitle: "",
  problemId: "",
  serviceName: "",
};

const ProblemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setProblem: (state, action) => {
      state.problemTitle = action.payload.main;
      state.subProblemTitle = action.payload.subproblemname;
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
