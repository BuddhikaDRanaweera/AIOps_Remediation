
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
import { useDispatch } from "react-redux";

import { setNewRemediation } from "../../app/features/modals_view/modal";
import { setProblem } from "../../app/features/problem/ProblemSlice";
import { IoMdClose } from "react-icons/io";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale, // Add this line
} from "chart.js";
import { BsArrowUpRightSquareFill } from "react-icons/bs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale // Add this line
);

// import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoading, error, data, getData } = useFetch_GET();
  const {
    isLoading: isLoadingActiveProblems,
    error: errorActiveProblems,
    data: dataActiveProblems,
    getData: getDataActiveProblems,
  } = useFetch_GET();

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (data) {
      setRecent((prev) => data?.activity);
    }
  }, [data]);

  const {
    isLoading: ptIsLoading,
    error: ptError,
    data: ptData,
    getData: ptGetData,
  } = useFetch_GET();

  const [isHighlightChecked, setIsHighlightChecked] = useState(false);
  const handleHighlightChange = () => {

    setIsHighlightChecked((prev) => !prev);
  };

  const navigateTo = (url) => {
    navigate(url);
  };

  // const getPID = (serviceName) => {
  //   if (data) {
  //     const find = data?.activity?.find(
  //       (item) => item.serviceName == serviceName
  //     );
  //     return find.pid;
  //   }
  // };

  const dispatch = useDispatch();

  useEffect(() => {
    getDataActiveProblems("/get_new_problems");
    getData("/audit-status");
    ptGetData("/problem-list");
}, []);

  // useEffect(()=>{
  //   setInterval(()=>{
  //     getDataActiveProblems("/get_new_problems");
      
  //   }, 5000)
  // },[])

 

  useEffect(() => {
    if (ptData) console.log(ptData, "title");
  }, [ptData]);

  const manage = [
    {
      id: 2,
      path: "/recommendation",
      title: "Manage Self-healing Rules",
      des: "View and manage rules",
      icon: "fa fa-pencil",
    },
    {
      id: 3,
      path: "/new-problem",
      title: "Create Self-healing Rule (Assisted)",
      des: "View New Problems",
      icon: "fa fa-exclamation-circle",
    },
    {
      id: 4,
      path: "/audit",
      title: "Remediation Audit Records",
      des: "View all remediations history",
      icon: "fa fa-table",
    },
  ];

  const setSelectedProblem = (title, serviceName, id) => {
    navigate("/new-problem");
    dispatch(
      setProblem({
        problemTitle: title,
        subProblemTitle: serviceName,
        problemId: id,
        serviceName: serviceName,
      })
    );
  };

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("");
  const [filter, setFilter] = useState([]);

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
    console.log(event.target.value, "status");
    // setFilter(prev => [...prev, event.target.value])
  };
  const handleChangeTitle = (event) => {
    setSelectedTitle(event.target.value);
    console.log(event.target.value, "status");
    // setFilter(prev => [...prev, event.target.value])
  };
  const handleChangeActionType = (event) => {
    setSelectedActionType(event.target.value);
    console.log(event.target.value, "status");
    // setFilter(prev => [...prev, event.target.value])
  };

  useEffect(() => {
    // if(selectedStatus !== ''){
    //  const fil = data?.activity?.filter((item) => item.status == selectedStatus);
    //  setRecent(prev => fil);
    // }

    const filteredData = data?.activity?.filter((item) => {
      return (
        (selectedStatus === "" || item.status === selectedStatus) &&
        (selectedTitle === "" || item.problemTitle.includes(selectedTitle)) &&
        (selectedActionType === "" || item.actionType === selectedActionType)
      );
    });

    setRecent((prev) => filteredData);
  }, [selectedStatus, selectedTitle, selectedActionType]);

  return (
    <div className=" p-5 flex flex-col gap-2 justify-between h-body ">
      <div className="flex flex-col gap-2 md:flex-row justify-between">
        <div className="w-full md:w-[635px] flex flex-col gap-2">
          <div className=" p-2 shadow-sm shadow-slate-400 bg-white flex flex-wrap gap-2">
            <div className="w-full">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
            </div>
            <div
              onClick={() => {
                dispatch(setNewRemediation(true));
              }}
              className="w-[300px] bg-slate-200 cursor-pointer flex gap-2 rounded-md  p-2 shadow-sm shadow-slate-400  hover:bg-slate-300"
            >
              <div className="my-auto">
                <i className={` fa fa-plus-square p-2`} aria-hidden="true"></i>
              </div>
              <div className="text-start my-auto">
                <p className="text-md">Create Self-healing Rule</p>
                <p className="text-xs">Define rules to identify problems</p>
              </div>
            </div>
            {manage?.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigateTo(item?.path);
                }}
                className=" w-[300px] flex gap-2 rounded-md  bg-slate-200 p-2 shadow-sm shadow-slate-400  hover:bg-slate-300"
              >
                <div className="my-auto">
                  <i className={` ${item?.icon} p-2`} aria-hidden="true"></i>
                </div>
                <div className=" text-start my-auto">
                  <p className="text-sm">{item?.title}</p>
                  <p className="text-xs">{item?.des}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-5 h-[300px] shadow-sm shadow-slate-400 overflow-auto">
            <div className="flex justify-between ">
              <h3 className="text-sm font-semibold">Open Problems</h3>
              <div className="flex justify-center bg-orange-50 min-h-10 min-w-10">
                <p className="font-bold m-auto text-2xl p-1">
                  {data?.opencount || 0}
                </p>
              </div>
            </div>
            <div className="py-2">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-200 text-sm">
                    <th className="p-2">id</th>
                    <th>title</th>
                    <th>service</th>
                    <th>sevirity level</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dataActiveProblems?.map((incident, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        setSelectedProblem(
                          incident?.problemTitle,
                          incident?.serviceName,
                          incident.id
                        )
                      }
                      className="bg-white hover:bg-slate-50 text-xs border-b border-gray-300"
                    >
                      <td className="p-2">{incident?.id}</td>
                      <td>{incident?.problemTitle}</td>
                      <td>{incident?.serviceName}</td>
                      <td>
                        {incident?.serviceName == "apache2" ? (
                          <div className="flex">
                            <p className=" m-auto w-12 bg-red-400 p-1 text-xs rounded-full text-white">
                              High
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className=" m-auto  w-12 bg-amber-600 p-1 text-xs rounded-full text-white">
                              Low
                            </p>
                          </div>
                        )}
                      </td>
                      <td>
                        <BsArrowUpRightSquareFill className="text-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[calc(100vw-660px)] h-[425px] p-5 bg-white shadow-sm shadow-slate-400">
          <div className="flex flex-col md:flex-row justify-between ">
            <h3 className="text-sm text-start font-semibold">
              Recent Incidents
            </h3>
            <div className="flex flex-wrap justify-end gap-2">
              <div className="flex items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200">
                <input
                  id="bordered-checkbox-1"
                  type="checkbox"
                  defaultValue={''}
                  checked={isHighlightChecked}
                  onChange={handleHighlightChange}
                  name="bordered-checkbox"
                  className=" text-blue-600 bg-gray-100 border-gray-300"
                />
                <label className="w-full text-gray-900">
                  <p className="text-xs p-0 m-0">Highlight</p>
                </label>
              </div>
              <select
                id="problem-title"
                defaultValue={""}
                value={selectedTitle}
                onChange={handleChangeTitle}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px]  focus:outline-none  block  p-1"
              >
                <option disabled value="">
                  select title
                </option>
                {ptData?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                id="problem-title"
                defaultValue={""}
                value={selectedActionType}
                onChange={handleChangeActionType}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px]  focus:outline-none  block  p-1"
              >
                <option disabled value="">
                  select Action Type
                </option>
                {["MANUAL", "AUTO"].map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                id="problem-title"
                defaultValue={""}
                value={selectedStatus}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px]  focus:outline-none  block  p-1"
              >
                <option disabled value="">
                  select status
                </option>
                {["OPEN", "CLOSED", "IN_PROGRESS"].map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="email-address-icon"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-[60%] ps-10 p-1"
                placeholder="search problems by service name"
              />
            </div>
            <div className="flex gap-2">
              {selectedStatus !== "" && (
                <div
                  onClick={() => setSelectedStatus("")}
                  className="flex  text-xs items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200"
                >
                  {selectedStatus} <IoMdClose />
                </div>
              )}
              {selectedActionType !== "" && (
                <div
                  onClick={() => setSelectedActionType("")}
                  className="flex  text-xs items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200"
                >
                  {selectedActionType} <IoMdClose />
                </div>
              )}
              {selectedTitle !== "" && (
                <div
                  onClick={() => setSelectedTitle("")}
                  className="flex  text-xs items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200"
                >
                  {selectedTitle} <IoMdClose />
                </div>
              )}
            </div>
          </div>

          <div className="py-2">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-200 text-sm">
                  <th className="p-2">id</th>
                  <th>title</th>
                  <th>service</th>
                  <th>status</th>
                  <th>action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent?.map((incident, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      navigateTo(
                        `/${incident?.pid}/${incident?.executedProblemId}`
                      );
                    }}
                    className={`${
                      incident?.status == "OPEN" &&
                      isHighlightChecked &&
                      "bg-red-50"
                    } ${
                      incident?.status == "CLOSED" &&
                      isHighlightChecked &&
                      "bg-green-50"
                    } ${
                      incident?.status == "IN_PROGRESS" &&
                      isHighlightChecked &&
                      "bg-orange-50"
                    } hover:bg-slate-50 text-xs border-b border-gray-300`}
                  >
                    <td className="p-2">{incident?.id}</td>
                    <td>{incident?.problemTitle}</td>
                    <td>{incident?.serviceName}</td>
                    <td>{incident?.status}</td>
                    <td>{incident?.actionType}</td>
                    <td>
                      <BsArrowUpRightSquareFill className="text-lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
