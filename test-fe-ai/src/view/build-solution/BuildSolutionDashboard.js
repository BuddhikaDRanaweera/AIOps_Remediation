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
  const [isLibraryChecked, setIsLibraryChecked] = useState(true);
  const [isCustomChecked, setIsCustomChecked] = useState(false);

  const handleLibraryChange = () => {
    setIsLibraryChecked(!isLibraryChecked);
    if (!isLibraryChecked) {
      setIsCustomChecked(false);
    }
  };

  const handleCustomChange = () => {
    setIsCustomChecked(!isCustomChecked);
    if (!isCustomChecked) {
      setIsLibraryChecked(false);
    }
  };


  const handleAction = () => {
    setSelectedAction((prev) => "not selected");
  };

  return (
    <>
      <div className="text-start p-5">
        <div className="px-2 flex md:flex-row flex-col gap-2">
          <div className="p-2 flex justify-start gap-2 bg-white w-[300px]">
            <div className="flex">
              <input
                id="library-checkbox"
                type="checkbox"
                checked={isLibraryChecked}
                onChange={handleLibraryChange}
                className="w-4 h-4 mx-2 my-auto text-slate-400 bg-gray-100 border-gray-300 rounded focus:ring-slate-100 focus:ring-2 "
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Library Integration</h3>
              <p className="text-xs ">
                Use existing libraries and external inputs.
              </p>
            </div>
          </div>
          <div className="p-2 flex justify-start gap-2 bg-white w-[300px]">
            <div className="flex">
              <input
                id="custom-checkbox"
                type="checkbox"
                checked={isCustomChecked}
                onChange={handleCustomChange}
                className="w-4 h-4 mx-2 my-auto  text-slate-400 bg-gray-100 border-gray-300 rounded focus:ring-slate-100 focus:ring-2 "
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Write a Custom Fix</h3>
              <p className="text-xs">Write your own scripts from scratch</p>
            </div>
          </div>
        </div>
        {isLibraryChecked && <BuildSolutionWithLibraries back={handleAction} />}
        {isCustomChecked && <CustomScript back={handleAction} />}
      </div>

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
