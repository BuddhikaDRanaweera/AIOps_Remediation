import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import "./BuildSolution.css";
import CustomScript from "./CreateCustomScript";
import BuildSolutionWithLibraries from "./LibraryIntegration";

const QuickActions = () => {
  const problem = useSelector((state) => state.problem);
  const [selectedAction, setSelectedAction] = useState("not selected");
  const navigate = useNavigate();

  useEffect(() => {
    // if (problem.problemId === "") navigate("/new-problem");
  }, []);

  // const renderDescription = () => {
  //   switch (selectedAction) {
  //     case "customFix":
  //       return <CustomScript />;
  //     case "libraryIntegration":
  //       return <BuildSolutionWithLibraries />;
  //     default:
  //       return <p>Select an action to build your solution.</p>;
  //   }
  // };

  const handleAction = () => {
    setSelectedAction((prev) => "not selected");
  };

  return (
    <>
      {selectedAction == "not selected" && (
        <div className="px-5">
          <h1 className=" text-3xl font-semibold text-start">Build Solution</h1>
          <div className="w-full flex flex-col gap-5 p-5">
            <div
              onClick={() => setSelectedAction((prev) => "customFix")}
              className="w-full border-2 flex h-52 shadow-md cursor-pointer hover:bg-main hover:text-white shadow-slate-400 text-main p-5 rounded-md m-auto"
            >
              <div className="my-auto text-start">
                <h4 className=" text-3xl">Write a Custom Fix</h4>
                <p>Write your own scripts from scratch.</p>
              </div>
            </div>
            <div
              onClick={() => setSelectedAction((prev) => "libraryIntegration")}
              className="w-full border-2 flex h-52 shadow-md cursor-pointer hover:bg-main hover:text-white shadow-slate-400 text-main p-5 rounded-md m-auto"
            >
              <div className="my-auto text-start">
                <h4 className=" text-3xl">Library Integration</h4>
                <p>Use existing libraries and external inputs.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedAction == "libraryIntegration" && (
        <BuildSolutionWithLibraries back={handleAction} />
      )}
      {selectedAction == "customFix" && <CustomScript back={handleAction} />}
    </>

    // <div>
    //   <div className="build-solution-header">
    //     <h2>Build Solution</h2>
    //   </div>
    //   <div className="build-solution-content">
    //     <h2>Quick Actions</h2>
    //   </div>
    //   <div className="build-solution-actions">
    //     <div
    //       className={`build-solution-action ${
    //         selectedAction === "customFix" ? "selected" : ""
    //       }`}
    //       onClick={() => setSelectedAction("customFix")}
    //     >
    //       <h4>Write a Custom Fix</h4>
    //       <p>Write your own scripts from scratch.</p>
    //     </div>
    //     <div
    //       className={`build-solution-action ${
    //         selectedAction === "libraryIntegration" ? "selected" : ""
    //       }`}
    //       onClick={() => setSelectedAction("libraryIntegration")}
    //     >
    //       <h4>Library Integration</h4>
    //       <p>Use existing libraries and external inputs.</p>
    //     </div>
    //   </div>

    //   <div className="build-solution-description">{renderDescription()}</div>
    // </div>
  );
};

export default QuickActions;
