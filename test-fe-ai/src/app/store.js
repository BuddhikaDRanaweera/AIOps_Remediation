import { combineReducers, configureStore } from "@reduxjs/toolkit";
import alertSlice from "./features/alert/alert";
import loadingSlice from "./features/loading/LoadingSlice";
import problemReducer from "./features/problem/ProblemSlice";
import selectedProblemReducer from "./features/selected_problem/SelectedProblemSlice";

const reducer = combineReducers({
  problem: problemReducer,
  selectedproblem: selectedProblemReducer,
  loading: loadingSlice,
  alert: alertSlice,
});

// Configure the store
const store = configureStore({
  reducer: reducer,
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
