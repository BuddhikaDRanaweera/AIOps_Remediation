import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import useFetch_GET from "../../services/http/Get";
import useFetch_POST from "../../services/http/Post";
// import "./BuildSolution.css";
import { FaHammer } from "react-icons/fa6";

function LibraryItem({
  title,
  icon,
  inputPlaceholder,
  action,
  value,
  path,
  pathValue,
  parameters,
  setparameters,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({});

  const handleInputChange = (event, item) => {
    const { value } = event.target;
    console.log(value, "event");
    console.log(item, "item");

    setFormData((prevData) => ({
      ...prevData,
      [item]: value,
    }));
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAdd = () => {
    // console.log(formData, "lll");
    // const dataArray = Object.values(formData);
    // console.log(dataArray, "lll2");
    setparameters(Object.values(formData));
    action(value);
    path(pathValue);
    setInputValue("");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className=" bg-slate-100 shadow-sm shadow-slate-400 rounded-md p-3">
      <div className="flex flex-row justify-between" onClick={toggleExpand}>
        {/* <div className="library-item-icon">{icon}</div> */}
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-lg font-bold">
          {isExpanded ? (
            <FaCircleMinus className="text-main" />
          ) : (
            <FaPlusCircle className="text-main" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3">
          {parameters?.map((item, index) => (
            <div key={index} className="mb-5">
              <label
                htmlFor={item.Key}
                className="block mb-2 text-sm font-medium text-gray-900 text-start"
              >
                {item.Key}
              </label>
              {item.type == "NUMBER" && (
                <input
                  type="number"
                  id={item.Key}
                  value={formData[item.Key] || ""}
                  onChange={(event) => handleInputChange(event, item.Key)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5"
                />
              )}

              {item.type == "SELECT" && (
                <select
                  id={item.Key}
                  defaultValue={""}
                  onChange={(event) => handleInputChange(event, item.Key)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5"
                >
                  <option value="" disabled>
                    Select an option
                  </option>

                  {item.values.map((val, index) => (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <div className="flex justify-end pb-3">
            <button
              onClick={handleAdd}
              className="text-white bg-main hover:bg-second focus:ring-2 focus:outline-none focus:ring-third font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Add to Solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BuildSolutionWithLibraries({ back }) {
  const {
    isLoading: postLoading,
    errorpostError,
    data: buildSolutionData,
    postData,
  } = useFetch_POST();

  const {
    isLoading: darftLoading,
    error: darftError,
    data: darftData,
    postData: saveDarftData,
  } = useFetch_POST();

  const [fileName, setFileName] = useState(null);

  const [selectedLibraries, setSelectedLibraries] = useState([]);

  const [path, setPath] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  useEffect(() => {
    if (buildSolutionData) setIsOpenPopup(true);
  }, [buildSolutionData]);

  useEffect(() => {
    setIsOpenPopup(false);
  }, [darftData]);

  const changeFileName = (e) => {
    setFileName(e.target.value);
  };

  const popup = () => {
    return (
      <div className="overflow-y-auto bg-blur flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-lvh">
        <div class="relative p-4 w-full">
          <div class="relative bg-white rounded-lg shadow-sm shadow-black p-2 h-cust">
            <div className="flex justify-between bg-main px-2 py-1">
              <h3 className="text-lg text-slate-500 text-start"></h3>
              <button
                onClick={() => setIsOpenPopup((prev) => "")}
                type="button"
                className=" text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  class="w-3 h-3"
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

            <Editor
              height="82%"
              defaultLanguage="bash"
              theme="vs-dark"
              value={buildSolutionData?.data}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                // You can add more options here
              }}
            />

            <div className="flex justify-end ">
              <div class="flex justify-end gap-2 p-2 w-[500px]">
                <label
                  for="file"
                  className="w-[20%] block mb-2 text-sm font-medium text-gray-900"
                >
                  File Name
                </label>
                <input
                  onChange={(event) => changeFileName(event)}
                  value={fileName}
                  type="text"
                  id="file"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:outline-none focus:ring-third block w-[50%] p-2.5"
                  // value={value}
                  // onChange={(event) => onChange(event.target.value)}
                />
                <div className="px-5 flex justify-end w-[30%]">
                  <button
                    disabled={fileName == null ? true : false}
                    onClick={() => {
                      saveToDirectory();
                    }}
                    type="submit"
                    className="text-white bg-main hover:bg-second focus:ring-2 focus:outline-none focus:ring-third font-medium rounded-lg text-sm w-full  text-center"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log(parameters, "param");
  }, [parameters]);

  const { isLoading, error, data, getData } = useFetch_GET();

  const handleAddLibrary = (libraryName) => {
    setSelectedLibraries([...selectedLibraries, libraryName]);
  };

  const buildSolution = () => {
    console.log("build solution");
    let solution = { filePaths: path };
    postData("/v2/build_script", solution);
  };

  const handlesetPath = (data) => {
    // console.log(data, "dsjhfbvjsd");
    // data?.map((item) => setPath([...path, item]));
    setPath([...path, data]);
  };

  const handlesetParameters = (data) => {
    // data?.map((item) => setParameters([...parameters, item]));
    // setParameters([...parameters, data]);
    const combinedArray = parameters.concat(data);
    setParameters((prev) => combinedArray);
  };

  const handleRemoveLibrary = (index) => {
    setSelectedLibraries(selectedLibraries.filter((_, i) => i !== index));
    setPath(path.filter((_, i) => i !== index));
  };

  const saveToDirectory = () => {
    let data = {
      content: buildSolutionData?.data,
      fileName: fileName,
      parameterValues: parameters,
    };
    saveDarftData("/v2/save-script-draft", data);
  };

  useEffect(() => {
    getData("/v2/libraries");
  }, []);

  useEffect(() => {
    console.log(data, "ggg");
  }, [data]);

  const libraries = [
    {
      category: "User",
      description: "dscs",
      id: 1,
      parameters: ["serviceName", "jvm-min", "jvm-max"],
      scriptName: "If running Start script",
      scriptPath: "src/path",
      serviceName: "apache2",
    },
    {
      category: "User",
      description: "dscs",
      id: 1,
      parameters: ["serviceName"],
      scriptName: "If running check service",
      scriptPath: "src/path",
      serviceName: "car-service",
    },
    {
      category: "User",
      description: "dscs",
      id: 1,
      parameters: ["serviceName"],
      scriptName: "If running check service",
      scriptPath: "src/path",
      serviceName: "nginX",
    },
  ];

  return (
    <div className="flex justify-between p-2">
      <div className=" relative w-[50%] h-cust">
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
                  Library Integration
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/*  */}

        <div className=" bg-white rounded-lg">
          <div className=" p-2 w-full">
            <h3 className=" font-semibold text-start ">
              Build Solution with Libraries
            </h3>
          </div>
          <div className="flex flex-col p-2 gap-1 h-[calc(100vh-200px)] overflow-auto">
            {data?.map((item, index) => (
              <LibraryItem
                key={index}
                title={item.scriptName}
                icon={<i className="fa fa-circle" />}
                inputPlaceholder={item.description}
                value={item.scriptName}
                path={handlesetPath}
                setparameters={handlesetParameters}
                pathValue={item.scriptPath}
                action={handleAddLibrary}
                parameters={item.parameters}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-[50%] px-2">
        <div className="bg-white h-[calc(100vh-110px)] rounded-lg overflow-hidden">
          <div className="bg-main py-2 px-3  flex justify-between">
            <div className="flex">
              <h3 className="text-white my-auto">
                Selected Libraries ({selectedLibraries.length})
              </h3>
            </div>
            <div className="flex">
              <button
                className=" hover:bg-third rounded-md py-1 px-2 text-white flex justify-center gap-2"
                onClick={() => {
                  buildSolution();
                }}
              >
                <FaHammer className="text-white text-md my-auto" />
                Build
              </button>
            </div>
          </div>
          <div>
            <ul className="p-2">
              {selectedLibraries.map((library, index) => (
                <li
                  key={index}
                  className="bg-slate-100 p-2 flex justify-between"
                >
                  {library}
                  <button
                    className="bg-indigo-100 hover:bg-indigo-200 rounded-md p-1 "
                    onClick={() => handleRemoveLibrary(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {isOpenPopup && popup()}
    </div>
  );
}

export default BuildSolutionWithLibraries;
