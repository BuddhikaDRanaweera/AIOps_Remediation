import React, { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import { formatDateString } from "../../util/helper-func/DateConverter";
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

import { useDispatch } from "react-redux";
import {
  clearGlobalLoading,
  setGlobalLoading,
} from "../../app/features/loading/LoadingSlice";
import axios from "axios";
import { useParams } from "react-router-dom";


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

function AssistedAnalysis() {
  const { PID, ExecutionId } = useParams();
  const baseDTUrl=process.env.REACT_APP_DT_BASE_URL
  const apiKey =process.env.REACT_APP_DT_TOKEN
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [dataCPU, setDataCPU] = useState();
  const [dataMem, setDataMem] = useState(null);
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

  const getDate = (time) => {
    const date = new Date(time);
    // Get the day, month, year, hours, and minutes
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day}/${month}/${year} - ${String(hours).padStart(
      2,
      "0"
    )} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getDownTime = () => {
    const differenceMs = Math.abs(data?.startTime - data?.endTime);
    const totalMinutes = Math.floor(differenceMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${String(hours).padStart(2, "0")} hours ${String(
      minutes
    ).padStart(2, "0")} mins`;
    return formattedTime;
  };

  const [data2, setData2] = useState(null);
  const [dataForCpuIdle, setDataForCpuIdle] = useState(null);
  const [dataForCpuUser, setDataForCpuUser] = useState(null);
  const [dataForCpuSystem, setDataForCpuSystem] = useState(null);
  const [errorRateGraphs, setErrorRateGraphs] = useState([]);
  const [errorRateGraphsView, setErrorRateGraphsView] = useState([]);

  useEffect(() => {
   if(errorRateGraphs.length !== 0){
   const newError =  errorRateGraphs?.map(item => {
      const leb = convertTimestamps(item?.graph?.label);
      const data = replaceNullWithZero(item?.graph?.data);
      return {
        labels: leb,

        datasets: [
          {
            label: item?.name,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,99,132,0.4)",
            borderColor: "rgba(255,99,132,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255,99,132,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data,
          },
        ],
      }
    });
    console.log(newError,'ffff');

    setErrorRateGraphsView(prev => newError);
   }
  },[errorRateGraphs])

  useEffect(() => {
    if (dataMem) {
      const leb = convertTimestamps(dataMem?.label);
      const data2 = replaceNullWithZero(dataMem?.data);
      console.log(leb, "leb");
      setData2((prev) => ({
        labels: leb,

        datasets: [
          {
            label: "Memory",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(54,162,235,0.4)",
            borderColor: "rgba(54,162,235,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(54,162,235,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(54,162,235,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data2,
          },
        ],
      }));
    }
  }, [dataMem]);

  useEffect(() => {
    if (dataCPU) {
      const lebIdle = convertTimestamps(dataCPU?.idle?.label);
      const idleData = replaceNullWithZero(dataCPU?.idle?.data);
      const lebUser = convertTimestamps(dataCPU?.user?.label);
      const userData = replaceNullWithZero(dataCPU?.user?.data);
      const lebSystem = convertTimestamps(dataCPU?.system?.label);
      const systemData = replaceNullWithZero(dataCPU?.system?.data);

      setDataForCpuIdle((prev) => ({
        labels: lebIdle,
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
            data: idleData,
          },
        ],
      }));
      setDataForCpuSystem((prev) => ({
        labels: lebSystem,
        datasets: [
          {
            label: "System",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(54,162,235,0.4)",
            borderColor: "rgba(54,162,235,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(54,162,235,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(54,162,235,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: systemData,
          },
        ],
      }));
      setDataForCpuUser((prev) => ({
        labels: lebUser,
        datasets: [
          {
            label: "User",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,99,132,0.4)",
            borderColor: "rgba(255,99,132,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255,99,132,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: userData,
          },
        ],
      }));
    }
  }, [dataCPU]);

  const url = `${baseDTUrl}/api/v2/problems/${PID}`;
  // const apiKey = 'dt0c01.POCZ4VADXFFGNIJD675DREU7.IPHH2YGQ346FC6K6YTMPOMIJN2MC7C2MSUJXWVZRJ5IEDIVRMSX2FIFP77G6XO6C'



  const getPreviousDate = (date) => {
    const previousDate = new Date(date);
    previousDate.setDate(date.getDate() - 1);
    console.log(previousDate.toISOString(), "hh");
    return previousDate.toISOString();
  };
  const getNextDate = (date) => {
    const previousDate = new Date(date);
    previousDate.setDate(date.getDate() + 1);
    console.log(previousDate.toISOString(), "hh");
    return previousDate.toISOString();
  };
  useEffect(() => {
    dispatch(setGlobalLoading({ loading: true }));
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          params: {
            "Api-Token": apiKey,
          },
        });
        console.log(response.data, "incident data");
        setData(response.data);
      } catch (error) {
        // alert(error.message);
        console.error("Error fetching data: ", error);
      } finally {
        dispatch(clearGlobalLoading());
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(setGlobalLoading({ loading: true }));
    if (data) {
      const sd = new Date(data?.startTime);
      const start = getPreviousDate(sd);
      const startDate = start;
      console.log(data?.endTime, 'end date')
      const ed = data?.endTime == -1 ? new Date() : new Date(data?.endTime);
      const end = getNextDate(ed);
      const endDate = end;

      const fetchDataCPU = async () => {
        try {
          console.log(endDate, 'end date')
          const response = await axios.get(
            `${baseDTUrl}/api/v2/metrics/query?metricSelector=builtin:host.cpu.(idle,user,system)&resolution=1h&from=${startDate}&to=${endDate}`,
            {
              params: {
                "Api-Token": apiKey,
              },
            }
          );
          console.log(response.data, "cpu data");
          const idle = response.data.result[0].data[0];
          const user = response.data.result[1].data[0];
          const system = response.data.result[2].data[0];
          const cpuData = {
            idle: { label: idle?.timestamps, data: idle?.values },
            user: { label: user?.timestamps, data: user?.values },
            system: { label: system?.timestamps, data: system?.values },
          };
          setDataCPU((prev) => cpuData);
        } catch (error) {
          // alert(error.message);
          console.error("Error fetching data: ", error);
        } finally {
          dispatch(clearGlobalLoading());
        }
      };

      const fetchDataMemory = async () => {
        try {
          const response = await axios.get(
            `${baseDTUrl}/api/v2/metrics/query?metricSelector=builtin:host.mem.usage&resolution=1h&from=${startDate}&to=${endDate}`,
            {
              params: {
                "Api-Token": apiKey,
              },
            }
          );

          const res = response.data.result[0].data[0];
          console.log(res, "memory data");
          const mem = {
            label: res?.timestamps,
            data: res?.values,
            topic: `Memory Usage of ${res?.dimensionMap["dt.entity.host"]}`,
          };
          console.log(mem, "memory bb data");
          setDataMem((prev) => mem);
        } catch (error) {
          // alert(error.message);
          console.error("Error fetching data: ", error);
        } finally {
          dispatch(clearGlobalLoading());
        }
      };

      const fetchDataErrorRate = async () => {
        try {
          const response = await axios.get(
            `${baseDTUrl}/api/v2/metrics/query?metricSelector=builtin:service.errors.total.rate&from=${startDate}&to=${endDate}`,
            {
              params: {
                "Api-Token": apiKey,
              },
            }
          );

          const res = response.data.result[0].data;
          console.log(response, "erroe")
          const errorRatesGraphs = res.map(item => ({
            name: item.dimensionMap["dt.entity.service"],
            graph: {
              label: item.timestamps,
              data: item.values
            }
          }));

          setErrorRateGraphs(prev => errorRatesGraphs);

          // console.log(errorRatesGraphs, 'errors ..s');
          
          // const mem = {
          //   label: res?.timestamps,
          //   data: res?.values,
          //   topic: `Memory Usage of ${res?.dimensionMap["dt.entity.host"]}`,
          // };
          // console.log(mem, "memory bb data");
          // setDataMem((prev) => mem);
        } catch (error) {
          // alert(error.message);
          console.error("Error fetching data: ", error);
        } finally {
          dispatch(clearGlobalLoading());
        }
      };


      fetchDataCPU();
      fetchDataMemory();
      fetchDataErrorRate();
    }
  }, [data]);

  return (
    // <>{data && (<div className="p-5 flex flex-col gap-5 h-body overflow-auto">
    //   <div className="w-full flex flex-wrap gap-1">
    //     <div className="mx-auto p-5 md:w-[63%] bg-white shadow-sm shadow-slate-400">
    //       <div className="flex gap-2 mb-5 text-start text-lg text-gray-600 font-semibold">
    //         <MdSettingsSuggest className="my-auto text-3xl" />
    //         <h3 className=" text-xl my-auto">
    //           {data?.impactedEntities[0].name} {data?.title}
    //         </h3>
    //       </div>
    //       <div className="flex flex-wrap gap-10">
    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">Problem Id</h3>
    //           <h3 className=" text-start text-sm ">{data?.displayId}</h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">
    //             Detected Time
    //           </h3>
    //           <h3 className=" text-start text-sm">
    //             {data && formatDateString(getDate(data?.startTime))}
    //           </h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">
    //             Analysis End Date
    //           </h3>
    //           <h3 className=" text-start text-sm">
    //             {data &&
    //               (data?.endTime == "-1"
    //                 ? "-"
    //                 : formatDateString(getDate(data?.endTime)))}
    //           </h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">
    //             Total Down Time
    //           </h3>
    //           <h3 className=" text-start text-sm text-orange-400">
    //             {data && getDownTime()}
    //           </h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">Impact Level</h3>
    //           <h3 className=" text-start text-sm">{data?.impactLevel}</h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">
    //             Severity Level
    //           </h3>
    //           <h3 className=" text-start text-sm">{data?.severityLevel}</h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">Status</h3>
    //           <h3
    //             className={` text-start font-semibold text-sm ${
    //               data?.status == "CLOSED" ? "text-green-800" : "text-red-500"
    //             }`}
    //           >
    //             {data?.status}
    //           </h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">
    //             Root Cause ID
    //           </h3>
    //           <h3 className=" text-start text-sm">
    //             {data?.rootCauseEntity?.entityId?.id || "-"}
    //           </h3>
    //         </div>

    //         <div className="w-[16%]">
    //           <h3 className="text-start text-xs font-semibold">Entity Name</h3>
    //           <h3 className=" text-start text-sm">
    //             {data?.rootCauseEntity?.name || "-"}
    //           </h3>
    //         </div>

    //         <div className="w-[100%]">
    //           <h3 className="text-start text-xs font-semibold">
    //             Problem description
    //           </h3>
    //           <h3 className=" text-start text-sm ">
    //             {data?.evidenceDetails?.details[0]?.data?.properties[0].value}
    //           </h3>
    //         </div>
    //       </div>
    //     </div>
    //     {data2 && (
    //       <div className="md:w-[36%] bg-white shadow-sm shadow-slate-400">
    //         <h3 className=" font-semibold text-start mb-2 bg-slate-100 p-3">
    //           Impacted Service
    //         </h3>
    //         <div className="p-3">
    //           {data?.affectedEntities?.map((item, index) => (
    //             <h3 key={index} className="text-xs text-start mb-3">{item.name}</h3>
    //           ))}
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   <h3 className="text-xl font-bold text-start">CPU Usage Graphs</h3>
    //   <div className="flex justify-center flex-wrap gap-1">
    //     {dataForCpuIdle && (
    //       <div className="md:w-[33%] bg-white shadow-sm shadow-slate-400 p-5">
    //         <Line data={dataForCpuIdle} />
    //       </div>
    //     )}
    //     {dataForCpuUser && (
    //       <div className="md:w-[33%] bg-white shadow-sm shadow-slate-400 p-5">
    //         <Line data={dataForCpuUser} />
    //       </div>
    //     )}
    //     {dataForCpuSystem && (
    //       <div className="md:w-[33%] bg-white shadow-sm shadow-slate-400 p-5">
    //         <Line data={dataForCpuSystem} />
    //       </div>
    //     )}

    //     {/* <div className='w-[33%] bg-white shadow-sm shadow-slate-400 p-5'>
    //        <Line data={data2} />
    //        </div>

    //        <div className='w-[33%] bg-white shadow-sm shadow-slate-400 p-5'>
    //        <Line data={data2} />
    //        </div> */}
    //   </div>
    //   <h3 className="text-xl font-bold text-start">Error Rate Graphs</h3>
    //   <div className="flex flex-wrap justify-between gap-1">

    //   {errorRateGraphsView.length !== 0 && errorRateGraphsView?.map(item => ( 
    //       <div className="md:w-[33%] bg-white shadow-sm shadow-slate-400 p-5">
    //         <Line data={item} />
    //       </div>
    //     ))}

    //   </div>
    //   <h3 className="text-xl font-bold text-start">Memory Usage Graphs</h3>
    //   <div>
    //     {data2 && (
    //       <div className="md:w-[40%] bg-white shadow-sm shadow-slate-400 p-5">
    //         <h3 className="mb-2 font-semibold text-start">{dataMem?.topic}</h3>
    //         <Line data={data2} />
    //       </div>
    //     )}
    //   </div>
    // </div>)}</>
    <>{data && (
      <div className="p-5 flex flex-col gap-5 h-body overflow-auto">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[63%] mx-auto p-5 bg-white shadow-sm shadow-slate-400">
            <div className="flex gap-2 mb-5 text-start text-lg text-gray-600 font-semibold">
              <MdSettingsSuggest className="my-auto text-3xl" />
              <h3 className="text-xl my-auto">
                {data?.impactedEntities[0].name} {data?.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Problem Id</h3>
                <h3 className="text-start text-sm">{data?.displayId}</h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Detected Time</h3>
                <h3 className="text-start text-sm">
                  {data && formatDateString(getDate(data?.startTime))}
                </h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Analysis End Date</h3>
                <h3 className="text-start text-sm">
                  {data &&
                    (data?.endTime == "-1"
                      ? "-"
                      : formatDateString(getDate(data?.endTime)))}
                </h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Total Down Time</h3>
                <h3 className="text-start text-sm text-orange-400">
                  {data && getDownTime()}
                </h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Impact Level</h3>
                <h3 className="text-start text-sm">{data?.impactLevel}</h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Severity Level</h3>
                <h3 className="text-start text-sm">{data?.severityLevel}</h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Status</h3>
                <h3
                  className={`text-start font-semibold text-sm ${
                    data?.status == "CLOSED" ? "text-green-800" : "text-red-500"
                  }`}
                >
                  {data?.status}
                </h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Root Cause ID</h3>
                <h3 className="text-start text-sm">
                  {data?.rootCauseEntity?.entityId?.id || "-"}
                </h3>
              </div>
    
              <div className="w-full md:w-[48%] lg:w-[16%]">
                <h3 className="text-start text-xs font-semibold">Entity Name</h3>
                <h3 className="text-start text-sm">
                  {data?.rootCauseEntity?.name || "-"}
                </h3>
              </div>
    
              <div className="w-full">
                <h3 className="text-start text-xs font-semibold">Problem description</h3>
                <h3 className="text-start text-sm">
                  {data?.evidenceDetails?.details[0]?.data?.properties[0].value}
                </h3>
              </div>
            </div>
          </div>
    
          {data2 && (
            <div className="w-full md:w-[36%] bg-white shadow-sm shadow-slate-400">
              <h3 className="font-semibold text-start mb-2 bg-slate-100 p-3">Impacted Service</h3>
              <div className="p-3">
                {data?.affectedEntities?.map((item, index) => (
                  <h3 key={index} className="text-xs text-start mb-3">{item.name}</h3>
                ))}
              </div>
            </div>
          )}
        </div>
    
        <h3 className="text-xl font-bold text-start">CPU Usage Graphs</h3>
        <div className="flex md:justify-start justify-center flex-wrap gap-4">
          {dataForCpuIdle && (
            <div className="w-full md:w-[48%] lg:w-[31%] bg-white shadow-sm shadow-slate-400 p-5">
              <Line data={dataForCpuIdle} />
            </div>
          )}
          {dataForCpuUser && (
            <div className="w-full md:w-[48%] lg:w-[31%] bg-white shadow-sm shadow-slate-400 p-5">
              <Line data={dataForCpuUser} />
            </div>
          )}
          {dataForCpuSystem && (
            <div className="w-full md:w-[48%] lg:w-[31%] bg-white shadow-sm shadow-slate-400 p-5">
              <Line data={dataForCpuSystem} />
            </div>
          )}
        </div>
    
        <h3 className="text-xl font-bold text-start">Error Rate Graphs</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {errorRateGraphsView.length !== 0 && errorRateGraphsView?.map((item, index) => (
            <div key={index} className="w-full md:w-[48%] lg:w-[33%] bg-white shadow-sm shadow-slate-400 p-5">
              <Line data={item} />
            </div>
          ))}
        </div>
    
        <h3 className="text-xl font-bold text-start">Memory Usage Graphs</h3>
        <div className="flex justify-center md:justify-start">
          {data2 && (
            <div className="w-full md:w-[60%] lg:w-[40%] bg-white shadow-sm shadow-slate-400 p-5">
              <h3 className="mb-2 font-semibold text-start">{dataMem?.topic}</h3>
              <Line data={data2} />
            </div>
          )}
        </div>
      </div>
    )}</>
    
  );
}

export default AssistedAnalysis;
