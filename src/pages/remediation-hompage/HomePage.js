import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
import { useDispatch } from "react-redux";

import { setNewRemediation } from "../../app/features/modals_view/modal";
import { setProblem } from "../../app/features/problem/ProblemSlice";
import { IoMdClose } from "react-icons/io";
import moment from "moment-timezone";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import axios from "axios";

import { Line, Radar } from "react-chartjs-2";
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

  const [onholdStageMetrics, setOnholdStageMetrics] = useState();
  const [onholdStageMetricsView, setOnholdStageMetricsView] = useState();

  const [implementationStageMetrics, setImplementationStageMetrics] =
    useState();
  const [implementationStageMetricsView, setImplementationStageMetricsView] =
    useState();

  const [viewMetric, setViewMetric] = useState({ type: "", view: false });

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

  useEffect(() => {
    const fetchDataMetrics = async () => {
      try {
        const response = await axios.get(
          `https://uag17776.live.dynatrace.com/api/v2/metrics/query?metricSelector=log.Stuck_Order_Onhold_Stage&resolution=10m&from=now-1d&to=now&entitySelector: type("HOST")`,
          {
            params: {
              "Api-Token":
                "dt0c01.M37LPHB2ES5R2IEHV46RNY66.U2Z4O2BWWO4OR2F7FQAGIX3Z3TZRABVIXZGS7PH3EP37SARQIQ5DR7VFGWC6TKOD",
            },
          }
        );

        const Stuck_Order_Onhold_Stage = response?.data?.result[0]?.data[0];
        console.log(Stuck_Order_Onhold_Stage, "Metrics data");
        setOnholdStageMetrics((prev) => ({
          label: Stuck_Order_Onhold_Stage?.timestamps,
          data: Stuck_Order_Onhold_Stage?.values,
        }));
      } catch (error) {
        // alert(error.message);
        console.error("Error fetching data: ", error);
      } finally {
      }
    };
    const fetchDataMetrics2 = async () => {
      try {
        const response = await axios.get(
          `https://uag17776.live.dynatrace.com/api/v2/metrics/query?metricSelector=log.Stuck_Order_Implementation_Stage&resolution=10m&from=now-1d&to=now&entitySelector:`,
          {
            params: {
              "Api-Token":
                "dt0c01.M37LPHB2ES5R2IEHV46RNY66.U2Z4O2BWWO4OR2F7FQAGIX3Z3TZRABVIXZGS7PH3EP37SARQIQ5DR7VFGWC6TKOD",
            },
          }
        );
        console.log(response?.data, "Metrics data 2");
        const Stuck_Order_Implementation_Stage =
          response?.data?.result[0]?.data[0];

        setImplementationStageMetrics((prev) => ({
          label: Stuck_Order_Implementation_Stage?.timestamps,
          data: Stuck_Order_Implementation_Stage?.values,
        }));
      } catch (error) {
        // alert(error.message);
        console.error("Error fetching data: ", error);
      } finally {
      }
    };

    fetchDataMetrics();
    fetchDataMetrics2();
  }, [viewMetric]);

  const replaceNullWithZero = (arr) => {
    return arr.map((item) => (item === null ? 0 : item));
  };

  const convertTimestamps = (arr) => {
    return arr.map((timestamp) => {
      const date = new Date(timestamp);
      const day = date.getUTCDate();
      const month = date.toLocaleString("default", { month: "short" });
      const hours = date.getUTCHours();
      const period = hours >= 12 ? "pm" : "am";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${day} ${month} ${formattedHours}${period}`;
    });
  };

  useEffect(() => {
    if (onholdStageMetrics) {
      const lebOnholdStageMetrics = convertTimestamps(
        onholdStageMetrics?.label
      );
      const dataOnholdStageMetrics = replaceNullWithZero(
        onholdStageMetrics?.data
      );

      setOnholdStageMetricsView((prev) => ({
        labels: lebOnholdStageMetrics,
        datasets: [
          {
            label: "Idle",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: dataOnholdStageMetrics,
          },
        ],
      }));
    }
  }, [onholdStageMetrics]);

  useEffect(() => {
    if (implementationStageMetrics) {
      const lebOnholdStageMetrics = convertTimestamps(
        implementationStageMetrics?.label
      );
      const dataOnholdStageMetrics = replaceNullWithZero(
        implementationStageMetrics?.data
      );

      setImplementationStageMetricsView((prev) => ({
        labels: lebOnholdStageMetrics,
        datasets: [
          {
            label: "Idle",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: dataOnholdStageMetrics,
          },
        ],
      }));
    }
  }, [implementationStageMetrics]);

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
      title: "Root Cause Troubleshoot",
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

  function formatDateToCustomFormat(dateString) {
    if (!dateString) return '';

    // Parse the date with moment, assume it's in UTC
    const dateInUTC = moment.utc(dateString);

    // Convert to IST and format
    return dateInUTC.format('YYYY:MM:DD-HH:mm:ss');
}


  return (
    <div className=" p-5 flex flex-col gap-2 justify-between h-body ">
      <div className="flex flex-col gap-2 md:flex-row justify-between">
        <div className="w-full md:w-[635px] flex flex-col gap-2">
          <div className=" p-2 shadow-sm shadow-slate-400 bg-white flex flex-col md:grid md:grid-cols-2 gap-2">
            <div className="col-span-2">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
            </div>
            <div
              onClick={() => {
                dispatch(setNewRemediation(true));
              }}
              className=" bg-slate-200 cursor-pointer flex gap-2 rounded-md  p-2 shadow-sm shadow-slate-400  hover:bg-slate-300"
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
                className="flex gap-2 rounded-md cursor-pointer  bg-slate-200 p-2 shadow-sm shadow-slate-400  hover:bg-slate-300"
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
          <div className=" p-2 shadow-sm h-[100px] shadow-slate-400 bg-white flex flex-col">
            <div className="mb-2">
              <h3 className="text-sm font-semibold">Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => {
                  setViewMetric((prev) => ({ type: "onHold", view: true }));
                }}
                className=" bg-slate-50 p-2 rounded-sm shadow-sm shadow-slate-400 flex justify-center cursor-pointer hover:bg-slate-100"
              >
                <p>Onhold Stage Metrics</p>
              </div>
              <div
                onClick={() => {
                  setViewMetric((prev) => ({
                    type: "implementation",
                    view: true,
                  }));
                }}
                className=" bg-slate-50 p-2 rounded-sm shadow-sm shadow-slate-400 flex justify-center cursor-pointer hover:bg-slate-100"
              >
                <p>Implementation Stage Metrics</p>
              </div>
            </div>
          </div>

          <div className="bg-white cursor-pointer p-5 h-[calc(100vh-380px)] shadow-sm shadow-slate-400">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-[33%]">
                  <h3 className="text-sm font-semibold">Open Problems</h3>
                </div>
                <div className="w-[33%]">
                  <h3 className="text-sm font-semibold">Inprogress Problems</h3>
                </div>
                <div className="w-[33%]">
                  <h3 className="text-sm font-semibold">Remediated Problems</h3>
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <div className="flex justify-center bg-red-50 max-h-10 w-[33%]">
                  <p className="font-bold m-auto text-2xl p-1">
                    {data?.opencount || 0}
                  </p>
                </div>
                <div className="flex justify-center bg-yellow-50 max-h-10 w-[33%]">
                  <p className="font-bold m-auto text-2xl p-1">
                    {data?.InProgressCount || 0}
                  </p>
                </div>
                <div className="flex justify-center bg-green-50 max-h-10 w-[33%]">
                  <p className="font-bold m-auto text-2xl p-1">
                    {data?.closedCount || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h3 className="text-sm font-bold">New Problems</h3>
            </div>
            {/* <div className="py-2 h-[calc(100vh-400px)] overflow-auto">
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
                      className="bg-white cursor-pointer hover:bg-slate-50 text-xs border-b border-gray-300"
                    >
                      <td className="p-2">{incident?.id}</td>
                      <td>{incident?.problemTitle}</td>
                      <td>{incident?.serviceName}</td>
                      <td>
                        {incident?.serviceName == "apache2" ? (
                          <div className="flex">
                            <p className=" m-auto text-center w-12 bg-red-400 p-1 text-xs rounded-full text-white">
                              High
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className=" m-auto  text-center w-12 bg-amber-600 p-1 text-xs rounded-full text-white">
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
            </div> */}
            <div className="py-2 overflow-auto h-[calc(100vh-400px)]">
              <table className="w-full hidden md:table">
                <thead>
                  <tr className="bg-slate-200 text-sm">
                    <th className="p-2">ID</th>
                    <th>Title</th>
                    <th>Service</th>
                    <th>Severity Level</th>
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
                      className="bg-white cursor-pointer hover:bg-slate-50 text-xs border-b border-gray-300"
                    >
                      <td className="p-2">{incident?.id}</td>
                      <td>{incident?.problemTitle}</td>
                      <td>{incident?.serviceName}</td>
                      <td>
                        <div className="flex">
                          <p
                            className={`m-auto text-center w-12 p-1 text-xs rounded-full text-white ${
                              incident?.serviceName === "apache2"
                                ? "bg-red-400"
                                : "bg-amber-600"
                            }`}
                          >
                            {incident?.serviceName === "apache2"
                              ? "High"
                              : "Low"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <BsArrowUpRightSquareFill className="text-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden space-y-4">
                {dataActiveProblems?.map((incident, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedProblem(
                        incident?.problemTitle,
                        incident?.serviceName,
                        incident.id
                      )
                    }
                    className="bg-white p-4 rounded-lg shadow-md border cursor-pointer hover:bg-slate-50"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        <p className="text-gray-600">ID: {incident?.id}</p>
                        <p className="text-gray-800">
                          {incident?.problemTitle}
                        </p>
                        <p className="text-gray-600">
                          Service: {incident?.serviceName}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p
                          className={`text-xs px-2 py-1 rounded-full text-white ${
                            incident?.serviceName === "apache2"
                              ? "bg-red-400"
                              : "bg-amber-600"
                          }`}
                        >
                          {incident?.serviceName === "apache2" ? "High" : "Low"}
                        </p>
                        <BsArrowUpRightSquareFill className="text-lg mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/* <div className="w-full cursor-pointer md:w-[calc(100vw-660px)] h-[calc(100vh-102px)] min-h-[469px] p-5 bg-white shadow-sm shadow-slate-400">
          <div className="flex flex-col md:flex-row justify-between ">
            <h3 className="text-sm text-start font-semibold">
              Recent Incidents
            </h3>
            <div className="flex flex-wrap justify-end gap-2">
              <div className="flex items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200">
                <input
                  id="bordered-checkbox-1"
                  type="checkbox"
                  defaultValue={""}
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
                  Select Title
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
                  Select Action Type
                </option>
                {["MANUAL", "AUTOMATIC"].map((item, index) => (
                  <option key={index} value={item}>
                    {item.toUpperCase()}
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
                  Select Status
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
        </div> */}
        <div className="w-full cursor-pointer md:w-[calc(100vw-660px)] h-[calc(100vh-102px)] min-h-[469px] p-5 bg-white shadow-sm shadow-slate-400">
          <div className="flex flex-col md:flex-row justify-between ">
            <h3 className="text-sm text-start font-semibold">
              Recent Incidents
            </h3>
            <div className="flex flex-wrap justify-end gap-2">
              <div className="flex items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200">
                <input
                  id="bordered-checkbox-1"
                  type="checkbox"
                  checked={isHighlightChecked}
                  onChange={handleHighlightChange}
                  name="bordered-checkbox"
                  className="text-blue-600 bg-gray-100 border-gray-300"
                />
                <label className="w-full text-gray-900">
                  <p className="text-xs p-0 m-0">Highlight</p>
                </label>
              </div>
              <select
                id="problem-title"
                value={selectedTitle}
                onChange={handleChangeTitle}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px] focus:outline-none block p-1"
              >
                <option disabled value="">
                  Select Title
                </option>
                {ptData?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                id="problem-title"
                value={selectedActionType}
                onChange={handleChangeActionType}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px] focus:outline-none block p-1"
              >
                <option disabled value="">
                  Select Action Type
                </option>
                {["MANUAL", "AUTOMATIC"].map((item, index) => (
                  <option key={index} value={item}>
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                id="problem-title"
                value={selectedStatus}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px] focus:outline-none block p-1"
              >
                <option disabled value="">
                  Select Status
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-[60%] pl-10 p-1"
                placeholder="search problems by service name"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedStatus && (
                <div
                  onClick={() => setSelectedStatus("")}
                  className="flex text-xs items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200"
                >
                  {selectedStatus} <IoMdClose />
                </div>
              )}
              {selectedActionType && (
                <div
                  onClick={() => setSelectedActionType("")}
                  className="flex text-xs items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200"
                >
                  {selectedActionType} <IoMdClose />
                </div>
              )}
              {selectedTitle && (
                <div
                  onClick={() => setSelectedTitle("")}
                  className="flex text-xs items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200"
                >
                  {selectedTitle} <IoMdClose />
                </div>
              )}
            </div>
          </div>

          <div className="py-2 h-[calc(100vh-320px)] md:h-[calc(100vh-220px)] overflow-auto">
            <table className="w-full  hidden md:table">
              <thead>
                <tr className="bg-slate-200 text-sm">
                  {/* <th className="p-2">ID</th> */}
                  <th className=" text-start p-2">Alert Details</th>
                  <th className=" text-start p-2 w-[180px]">Service</th>
                  <th className=" text-start p-2 w-[60px]">Status</th>
                  <th className=" text-start p-2 w-[60px]">S-Date</th>
                  <th className=" text-start p-2">E-Date</th>
                  <th className=" text-start p-2"> Action</th>
                  <th className=" text-start p-2"></th>
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
                      incident?.status === "OPEN" &&
                      isHighlightChecked &&
                      "bg-red-50"
                    } ${
                      incident?.status === "CLOSED" &&
                      isHighlightChecked &&
                      "bg-green-50"
                    } ${
                      incident?.status === "IN_PROGRESS" &&
                      isHighlightChecked &&
                      "bg-orange-50"
                    } hover:bg-slate-50 text-xs border-b border-gray-300`}
                  >
                    {/* <td className="p-2">{incident?.id}</td> */}
                    <td className=" text-start p-2">
                      {incident?.problemTitle}
                    </td>
                    <td className=" text-start p-2 w-[200px]">
                      {incident?.serviceName}
                    </td>
                    <td className=" text-start p-2">{incident?.status}</td>
                    <td className=" text-start p-2">
                      {formatDateToCustomFormat(incident?.problemDetectedAt)}
                    </td>
                    <td className=" text-start p-2">
                      {formatDateToCustomFormat(incident?.problemEndAt)}
                    </td>
                    <td className=" text-start p-2">{incident?.actionType}</td>
                    <td className=" text-start p-2">
                      <BsArrowUpRightSquareFill className="text-lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden space-y-4 h-[calc(100vh-330px)] px-2">
              {recent?.map((incident, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigateTo(
                      `/${incident?.pid}/${incident?.executedProblemId}`
                    );
                  }}
                  className={`${
                    incident?.status === "OPEN" &&
                    isHighlightChecked &&
                    "bg-red-50"
                  } ${
                    incident?.status === "CLOSED" &&
                    isHighlightChecked &&
                    "bg-green-50"
                  } ${
                    incident?.status === "IN_PROGRESS" &&
                    isHighlightChecked &&
                    "bg-orange-50"
                  } hover:bg-slate-50 p-4 rounded-lg shadow-md border`}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm font-medium space-y-1">
                      <p className="text-gray-600">ID: {incident?.id}</p>
                      <p className="text-gray-800 truncate">
                        {incident?.problemTitle}
                      </p>
                      <p className="text-gray-600 truncate max-w-[150px]">
                        Service: {incident?.serviceName}
                      </p>

                      <p className="text-gray-600">
                        Status: {incident?.status}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">{incident?.actionType}</p>
                      <BsArrowUpRightSquareFill className="text-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  */}
      </div>

      {/*  */}

      {viewMetric?.view && (
        <div className="bg-blur flex h-lvh justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50  items-center w-full md:inset-0 p-2   max-h-full">
          <div className="m-auto  relative  w-full md:w-[80%]  max-h-full rounded-md overflow-hidden bg-white shadow-sm shadow-slate-400">
            <div className="flex justify-between p-4 border-b border-gray-300">
              <h3 className=" text-lg font-bold">
                {viewMetric?.type == "onHold" && "Stuck Order Onhold Stage"}
                {viewMetric?.type == "implementation" &&
                  "Stuck Order Implementation Stage Metrics"}
              </h3>
              <button
                onClick={() => {
                  setViewMetric((prev) => ({ type: "", view: false }));
                }}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-5">
              {onholdStageMetricsView && viewMetric?.type == "onHold" && (
                <Line data={onholdStageMetricsView} />
              )}
              {implementationStageMetricsView &&
                viewMetric?.type == "implementation" && (
                  <Line data={implementationStageMetricsView} />
                )}
            </div>
          </div>
        </div>
      )}
      {/*  */}
    </div>
  );
};

export default HomePage;
