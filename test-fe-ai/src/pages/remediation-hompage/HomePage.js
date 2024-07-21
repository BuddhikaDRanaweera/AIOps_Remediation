import { formatDistanceToNow } from "date-fns";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
import { useDispatch } from "react-redux";

import { setNewRemediation } from "../../app/features/modals_view/modal";
import { setProblem } from "../../app/features/problem/ProblemSlice";

// import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoading, error, data, getData } = useFetch_GET();
  const { isLoading:isLoadingActiveProblems, error:errorActiveProblems, data:dataActiveProblems, getData:getDataActiveProblems } = useFetch_GET();

  const [quickViewServirityLevel, setQuickViewServirityLevel] = useState(false);

  const [newProblems, setNewProblem] = useState([]);
  const navigateTo = (url) => {
    navigate(url);
  };


  const getPID = (serviceName) => {
    if(data){
     const find = data?.activity?.find(item => item.serviceName == serviceName);
     return find.pid;
    }
  }



  const dispatch = useDispatch();

  useEffect(() => {
    getDataActiveProblems("/get_new_problems");
    getData("/audit-status");
  }, []);

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

  const getTimefor = (date) => {
    console.log(date, "date ..");
    let parsedDate;

    try {
      const d = moment
        .tz(date, "ddd, DD MMM YYYY HH:mm:ss [GMT]", "UTC")
        .tz("Asia/Colombo");

      parsedDate = new Date(d);
    } catch (error) {
      return <span>Invalid date</span>;
    }

    if (isNaN(parsedDate)) {
      return <span>Invalid date</span>;
    }

    const relativeTime = formatDistanceToNow(parsedDate.toDateString(), {
      addSuffix: true,
      unit: "minute",
    });

    return <span>{relativeTime.replace("in about ", "")}</span>;
  };

 
  const setSelectedProblem = (title, serviceName, id) => {
      
      navigate('/new-problem');
      dispatch(setProblem({problemTitle: title, subProblemTitle: serviceName, problemId: id, serviceName: serviceName,}))
  }

  return (
    <div
      
      className=" p-5 flex flex-col justify-between h-body "
    >
      {/*  */}

      

      {quickViewServirityLevel && (
        <div className="overflow-y-auto overflow-x-hidden bg-blur flex  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative m-auto p-4 w-[40%] min-w-md  max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setQuickViewServirityLevel(false)}
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
                <span class="sr-only">Close modal</span>
              </button>

              <div className="p-2 md:p-5">
                <div className="flex justify-start">
                  <h3 className=" font-semibold">Servirity Level</h3>
                </div>
                <div className="pt-2">
                  {dataActiveProblems?.map((item, index) => (
                    <div key={index} onClick={() => setSelectedProblem(item?.problemTitle,item?.serviceName,item.id)} className="flex justify-between hover:bg-slate-100 m-0.5 p-2  rounded-full">
                      <h3 className=" text-start text-sm my-auto">
                        {item?.problemTitle} for {item?.serviceName}
                      </h3>
                      {item?.serviceName == "apache2" ? (
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  */}
      <div className="flex justify-start h-[5%]">
        <h3 className=" text-2xl font-semibold">Remediation Dashboard</h3>
      </div>

      <div className="h-[95%] flex flex-col justify-between">
        {/* mange */}
        <div className=" cursor-pointer flex gap-2 justify-between my-5 ">
        <div
              onClick={() => {
                dispatch(setNewRemediation(true))
              }}
              className=" text-[#310078] flex w-[25%] rounded-md  bg-white p-5 shadow-sm shadow-slate-400 hover:text-white hover:bg-[#310078]"
            >
              <div className=" w-[25%] my-auto">
                <i className={` fa fa-plus-square text-3xl`} aria-hidden="true"></i>
              </div>
              <div className=" w-[75%] text-start m-auto">
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
              className=" text-[#310078] flex w-[25%] rounded-md  bg-white p-5 shadow-sm shadow-slate-400 hover:text-white hover:bg-[#310078]"
            >
              <div className=" w-[25%] my-auto">
                <i className={` ${item?.icon} text-3xl`} aria-hidden="true"></i>
              </div>
              <div className=" w-[75%] text-start m-auto">
                <p className="text-md">{item?.title}</p>
                <p className="text-xs">{item?.des}</p>
              </div>
            </div>
          ))}
        </div>
        {/* ---end--- */}

        <div className=" flex gap-2 justify-between flex-row h-[80%]">
          <div className="flex flex-col w-[40%] m-auto bg-white h-full rounded-lg shadow-sm shadow-slate-400">
            <h1 className=" text-start m-2 text-xl">Open Problems</h1>
            <div className=" group m-auto w-[350px] h-[350px] text-center align-middle flex justify-center ">
              <div className=" m-auto relative">
                <h1
                  onClick={() => setQuickViewServirityLevel(true)}
                  className=" hover:bg-slate-100 p-5 w-44 h-44 rounded-full  text-9xl font-bold text-[#310078]"
                >
                  {data?.count || 0}
                  <i
                    className="fa fa-exclamation text-red-500"
                    aria-hidden="true"
                  ></i>
                </h1>
              </div>
            </div>
          </div>
          <div className="w-[60%]">
            <h1 className="text-start m-2 text-xl">Recent Incidents</h1>
            <div className=" overflow-y-auto h-[450px] flex flex-col gap-1 text-black">
              {data?.activity && (
                <>
                  {data?.activity?.map((incident, index) => (
                    <div
                      className="hover:bg-[#310078] hover:text-white flex flex-row justify-between bg-white shadow-sm shadow-slate-400 p-2 rounded-md"
                      key={index}
                      onClick={() => {
                        navigateTo(
                          `/${incident?.pid}/${incident?.executedProblemId}`
                        );
                      }}
                    >
                      <div className="text-start">
                        <p className="text-sm font-semibold">
                          {incident?.problemTitle} for {incident?.serviceName}
                        </p>
                        <p className=" text-xs">
                          Remidiator took{" "}
                          <b>{incident?.actionType.toLowerCase()}</b> action and
                          currunt status is {incident?.status}
                        </p>
                      </div>
                      <div className="flex flex-col justify-end font-extralight">
                        <p className="text-sm">
                          {/* {incident?.problemDetectedAt} */}
                          {getTimefor(incident?.problemDetectedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {(!data?.activity || data?.activity?.length == 0) && (
                <div className="flex flex-row justify-between bg-white shadow-sm shadow-slate-400 p-2 rounded-md">
                  <h3>No Recent Incidents.</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
