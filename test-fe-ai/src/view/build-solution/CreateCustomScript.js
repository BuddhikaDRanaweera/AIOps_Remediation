import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetch_POST from "../../services/http/Post";
// import "./BuildSolution.css";
import SolutionRepository from "./SolutionRepository";

function CustomScript({ back }) {
  const navigate = useNavigate();
  const { isLoading, error, data, postData } = useFetch_POST();
  const problem = useSelector((state) => state.problem);

  const [script, setScript] = useState("");
  const [parameters, setParameters] = useState([]);
  const [fileName, setFileName] = useState("");
  const [filePath, setfilePath] = useState("");

  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState("");

  const handleInputChange = (event) => {
    setScript(event);
  };

  const handleInputChange_ = (event, parm) => {
    console.log(event.data, "handle ___ change");
    console.log(parm, "param in creation");

    if (parm) {
      setParameters((prev) => parm);
    } else {
      setParameters((prev) => []);
    }
    setScript(event.data);
  };

  const setPath = (data) => {
    setfilePath(data);
  };

  const clearNotepad = () => {
    setScript("");
  };

  const save = () => {
    if (fileName !== "") {
      setIsOpenPopup((prev) => "");
      let data = {
        content: script,
        fileName: fileName,
      };
      postData(`/v2/save-script`, data);
    }
  };

  const onChangeFile = (value) => {
    setFileName((prev) => value);
  };

  const saveSolution = () => {
    let data1 = {
      recommendation: "This is for server start",
      resolutionScript: filePath,
      problemTitle: problem.problemTitle,
      problemId: problem.problemId,
      serviceName: problem.serviceName,
      parametersValue: parameters,
    };

    console.log(data1, "solution");
    postData(`/insert_remediation`, data1);
  };

  if (data?.status == 200 || data?.status == 201) {
    navigate("/new-problem");
  }

  const popup = (topic, action, fnc, value, onChange) => {
    return (
      <div className="overflow-y-auto bg-blur flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-lvh">
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow-sm shadow-black overflow-hidden">
            <div className="bg-main p-1 flex justify-between">
              <h3 className="text-lg text-white my-auto text-start px-2">
                {topic}
              </h3>
              <button
                onClick={() => setIsOpenPopup((prev) => "")}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-third hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {action == "Save" && (
              <div class="flex justify-center gap-2 p-5">
                <label
                  for="file"
                  className="w-[30%] block mb-2 text-sm font-medium text-gray-900"
                >
                  File Name
                </label>
                <input
                  type="text"
                  id="file"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:outline-none focus:ring-third block w-[70%] p-2.5"
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                />
              </div>
            )}
            <div className="flex p-5">
              {action == "Save As Rule" && (
                <div className="text-start m-auto">
                  <h3 className="flex flex-row gap-2">
                    <p className=" font-semibold">Title :</p>
                    {problem?.problemTitle}
                  </h3>
                  <h3 className="flex flex-row gap-2">
                    <p className=" font-semibold">Service Name :</p>
                    {problem?.serviceName}
                  </h3>
                </div>
              )}
            </div>
            <div className="px-5 mb-5 flex justify-end">
              <button
                disabled={script == ""}
                onClick={() => fnc()}
                type="submit"
                className="text-white bg-main hover:bg-second focus:ring-2 focus:outline-none focus:ring-third font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                {action}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between h-cust">
      <div
        onClick={() => {
          if (isOpenAction) setIsOpenAction(false);
        }}
        className="w-[60%] p-2"
      >
        {/*  */}
        <nav
          className="mb-1 flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50"
          aria-label="Breadcrumb"
        >
          <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li>
              <div className="flex items-center">
                <a className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                  New Problem
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  onClick={() => back()}
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
                >
                  Build Solution
                </a>
              </div>
            </li>

            <li aria-current="page">
              <div class="flex items-center">
                <svg
                  class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                  Custom Fix
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/*  */}

        <div className="relative flex justify-end bg-main px-3">
          <div className=" hover:bg-blur rounded-md p-1 ">
            <HiDotsHorizontal
              onClick={() => setIsOpenAction((prev) => !prev)}
              className=" text-2xl text-white"
            />
          </div>

          {isOpenAction && (
            <div className=" absolute top-9 right-4 flex flex-col gap-1 w-32 z-40 bg-white p-3 rounded-md text-start">
              <h3
                onClick={() => setIsOpenPopup((prev) => "save")}
                className=" hover:text-main"
              >
                Save
              </h3>
              {filePath !== "" && filePath && (
                <h3
                  onClick={() => setIsOpenPopup((prev) => "saveAsRule")}
                  className=" hover:text-main"
                >
                  Save As Rule
                </h3>
              )}
              <h3 onClick={() => clearNotepad()} className=" hover:text-main">
                Clear
              </h3>
            </div>
          )}
        </div>

        <Editor
          height={`${parameters && parameters.length !== 0 ? "85%" : "92%"} `}
          defaultLanguage="bash"
          theme="vs-dark"
          value={script}
          onChange={handleInputChange}
        />

        {parameters && parameters.length !== 0 && (
          <div className="bg-white h-10 flex p-2">
            <div className="my-auto px-5">
              <h3 className="text-sm font-semibold">Parameters</h3>
            </div>
            <div className="flex gap-1">
              {parameters?.map((item) => (
                <h3 className="bg-slate-100 rounded-md px-2 font-semibold">
                  {item}
                </h3>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className=" w-[40%] pe-2 pt-2">
        <SolutionRepository
          handleInputChange={handleInputChange_}
          setPath={setPath}
        />
      </div>

      {isOpenPopup == "save" &&
        popup("Create Custom Script", "Save", save, fileName, onChangeFile)}
      {isOpenPopup == "saveAsRule" &&
        popup(
          "Create Custom Script As Rule",
          "Save As Rule",
          saveSolution,
          fileName,
          onChangeFile
        )}
    </div>

    //
  );
}

export default CustomScript;
