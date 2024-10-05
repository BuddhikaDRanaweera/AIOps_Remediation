import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AlertComponent from "./components/alert/Alert.js";
import BackDropComponent from "./components/backdrop/BackDrop.js";
import Progressbar from "./components/progress/Progressbar.js";
import TopBar from "./components/topbar/top-bar.js";
import AssistedAnalysis from "./view/assisted-analysis/AssistedAnalysisDashboard.js";
import QuickActions from "./view/build-solution/BuildSolutionDashboard.js";
import CustomScript from "./view/build-solution/CreateCustomScript.js";
import BuildSolutionWithLibraries from "./view/build-solution/LibraryIntegration.js";
import SolutionRepository from "./view/build-solution/SolutionRepository.js";
import { clearProblem } from "./app/features/problem/ProblemSlice.js";
import Metrics from "./view/metrics/Metrics.js";

const HomePage = lazy(() => import("./pages/remediation-hompage/HomePage.js"));
const EditRuleForm = lazy(() =>
  import("./view/remediation-dashboard/EditRuleForm.js")
);
const Dashboard = lazy(() => import("./view/remediation-dashboard/Index.js"));
const ExecutionHistory = lazy(() =>
  import("./view/remediation-execution-records/execution-dashboard.js")
);
const ProblemDetail = lazy(() =>
  import("./view/problem-detail/ProblemDetail.js")
);
const CreateNewRuleForm = lazy(() =>
  import("./view/remediation-dashboard/CreateNewRuleForm.js")
);
const RemediationTable = lazy(() =>
  import("./view/remediation-table/RemediationTable.js")
);

function App() {
  const dispatch = useDispatch();
  let loading = useSelector((state) => state.loading.loading);
  let alert = useSelector((state) => state.alert);
   useEffect(() => {
     dispatch(clearProblem());
   },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Suspense
          fallback={
            <div>
              <BackDropComponent />
            </div>
          }
        >
          <TopBar />
          {loading && (
            <div className="progress-bar-container">
              <Progressbar />
            </div>
          )}
          {alert.open && (
            <div className="alert-container">
              <AlertComponent />
            </div>
          )}

          <Routes>
            <Route
              exact
              path="/audit"
              name="Audit"
              element={<ExecutionHistory />}
            />
            <Route
              exact
              path="/audit/:id"
              name="Audit"
              element={<ExecutionHistory />}
            />

            <Route
              exact
              path="/recommendation"
              name="View-Recommendation"
              element={<RemediationTable />}
            />

            <Route
              exact
              path="/recommendation/:remediationId/:problemId"
              name="Edit-Recommendation"
              element={<EditRuleForm />}
            />
            <Route
              exact
              path="/:PID/:ExecutionId/:AuditId"
              name="Problem-Detail"
              element={<ProblemDetail />}
            />
            <Route
              exact
              path="/new-rule"
              name="Create-New-Rule"
              element={<CreateNewRuleForm />}
            />
            <Route
              exact
              path="/new-problem"
              name="Home"
              element={<Dashboard />}
            />
            <Route
              exact
              path="/build-solution"
              name="Build-Solution"
              element={<QuickActions />}
            />
            <Route
              exact
              path="/create-custom-script"
              name="Create-Custom-Script"
              element={<CustomScript />}
            />
            <Route
              exact
              path="/build-solution-with-libraries"
              name="Build-Solution-With-Libraries"
              element={<BuildSolutionWithLibraries />}
            />
            <Route
              exact
              path="/solution-repository"
              name="Solution-Repository"
              element={<SolutionRepository />}
            />
            <Route
            exact
            path="/metric-explore"
            name='Metrics-Explore'
            element={<Metrics />}
             />
            <Route
              exact
              path="/assisted-analysis/:PID"
              name="Assisted-Analysis"
              element={<AssistedAnalysis />}
            />
            <Route exact path="/" name="Home" element={<HomePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
