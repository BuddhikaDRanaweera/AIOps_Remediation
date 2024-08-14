import React, { useEffect, useState } from "react";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { MdExpandCircleDown } from "react-icons/md";
import useFetch_GET from "../../services/http/Get";
import useFetch_POST from "../../services/http/Post";
// import "./BuildSolution.css";

function SolutionRepository({ handleInputChange, setPath }) {

  const { isLoading, error, data, getData } = useFetch_GET();
  let {
    isLoading: postLoading,
    error: postError,
    data: postData_,
    postData,
  } = useFetch_POST();

  const [activeSolution, setActiveSolution] = useState(null);

  const [parm, setParm] = useState([]);
  
  const openTab = (tabName) => {
    setActiveTab(tabName);
    setActiveSolution(null); // Reset active solution when changing tabs
  };

  const openSolution = (solutionName) => {
    setActiveSolution(solutionName);
  };

  useEffect(() => {
    if (postData_) {
      handleInputChange(postData_, parm);
    }
  }, [postData_]);

  const getLibrary = (value, parameters) => {
    let path = {
      filePaths: [value],
    };
    setPath(value);
    setParm((prev) => parameters);
    postData("/v2/build_script", path);
  };

  useEffect(() => {
    getData("/v2/libraries_by_category");
  }, []);

  useEffect(() => {
    console.log(data, "libraries_by_category");
  }, [data]);

  const [activeTab, setActiveTab] = useState("all");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white shadow-sm shadow-slate-400 h-[calc(100vh-160px)]">
      <div className="flex justify-between">
        <div className="p-2 text-start">
          <h1 className=" text-sm font-semibold">
            Explore and Apply Pre-Made Solutions
          </h1>
          <p className=" text-xs">
            Access pre-made scripts for quick solutions
          </p>
        </div>
        {/*  */}
      </div>
      <div className="p-2">
        <div className="m-0 bg-slate-200  flex justify-between">
          <div className="flex gap-2">
            <h3
              onClick={() => setActiveTab((prev) => "all")}
              className={`mb-0 font-semibold text-sm p-4 ${
                activeTab == "all" && "border-b-2 border-black"
              }`}
            >
              All
            </h3>
            <h3
              onClick={() => setActiveTab((prev) => "new")}
              className={`mb-0 font-semibold text-sm p-4  ${
                activeTab == "new" && "border-b-2 border-black"
              }`}
            >
              New
            </h3>
          </div>
          <div className="flex px-2">
            <form className=" m-auto ">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <IoSearch className="text-gray-700" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50  outline-none text-gray-900 text-sm block w-full ps-10 p-2"
                  placeholder="Scripts in the library"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="h-[calc(100vh-240px)] overflow-auto">
          {data && (
            <>
              {Object.entries(data)?.map(([key, value]) => (
                <div key={key}>
                  <Libraries_by_category
                    title={key}
                    libs={value}
                    getLib={getLibrary}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SolutionRepository;

export const Libraries_by_category = ({ title, libs, getLib }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className="p-2 border-b border-slate-200 ">
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex justify-between"
      >
        <div className="flex gap-2">
          <i
            className={` text-sm fa ${
              title === "User management" ? "fa-users" : "fa-cogs"
            }`}
            aria-hidden="true"
          ></i>
          <h3 className=" font-semibold text-xs">{title}</h3>
        </div>
        <div className="flex">
          {isExpanded ? (
            <IoIosArrowDropupCircle className="my-auto text-xl" />
          ) : (
            <MdExpandCircleDown className="my-auto text-xl" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="py-2 ">
          {libs?.map((item, index) => (
            <div key={index} className="flex gap-2 mb-1 py-1 px-2 cursor-pointer">
              <i
                className={`my-auto text-gray-500 fa ${
                  item?.scriptName?.includes("start") ? "fa-play" : "fa-file"
                }`}
                aria-hidden="true"
              ></i>
              <span
                className="my-auto text-gray-500 hover:text-black text-sm"
                onClick={() => {
                  getLib(item?.scriptPath, item?.parameterValues);
                }}
              >
                {item.scriptName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
