import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearGlobalLoading,
  setGlobalLoading,
} from "../../app/features/loading/LoadingSlice";
import useFetch_GET from "../../services/http/Get";
import { MdSettingsSuggest } from "react-icons/md";
import { IoIosApps } from "react-icons/io";
import { GrServices } from "react-icons/gr";
import { FaServer } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import {
  formatDateString,
  formatDateToCustomFormat,
} from "../../util/helper-func/DateConverter";
import useFetch_POST from "../../services/http/Post";
import Timeline from "../../components/timeline/TimeLine";
import { changes } from "../../util/db";

const ProblemDetail = () => {
  const { PID, ExecutionId } = useParams();
  const { data: apiData, getData } = useFetch_GET();
  const { data: lastSixHourIncidents, postData: postIncidents } =
    useFetch_POST();
  // console.log(PID);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState();
  // console.log(apiData);
  const url = `https://uag17776.live.dynatrace.com/api/v2/problems/${PID}`;
  // https://xdy01853.live.dynatrace.com/api/v2/apiTokens
  const apiKey =
    "dt0c01.SXQEW54MQL5FLY2CNDD4SILS.AR67H437SVENVZIOOSWZ6GXFTQH5IVTS2UAT6RZ7CZ57DPITCOW7BPR34OGCTA7L";
  useEffect(() => {
    dispatch(setGlobalLoading({ loading: true }));
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          params: {
            "Api-Token": apiKey,
          },
        });
        // console.log(response.data, "incident data");
        setData(response?.data);
      } catch (error) {
        alert(error?.message);
        // console.error("Error fetching data: ", error);
      } finally {
        dispatch(clearGlobalLoading());
      }
    };
    getData(`/problem_recommendations/${ExecutionId}/${PID}`);
    fetchData();
  }, []);

  useEffect(() => {
    if (apiData && apiData?.length !== 0) {
      console.log(apiData[0]?.problemTitle, "data");
      const pt = apiData[0]?.problemTitle;
      postIncidents(`/last-6hr-incidents`, {
        problemTitle: pt,
      });
    }
  }, [apiData]);

  const getDownTime = () => {
    const differenceMs = Math.abs(data?.startTime - data?.endTime);
    const totalMinutes = Math.floor(differenceMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${String(hours).padStart(2, "0")} hours ${String(
      minutes
    ).padStart(2, "0")} mins`;
    if (data?.endTime == -1) {
      return "On going";
    } else {
      return formattedTime;
    }
  };

  return (
    <>
      <div className=" flex flex-col gap-1 justify-center">
        <div className="flex flex-col md:flex-row justify-center gap-2 px-5 pt-5">
          <div className="md:w-[60%] flex">
            <div className="mx-auto p-5 w-full bg-white shadow-sm shadow-slate-400">
              <Timeline />
            </div>
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-1 justify-between h-body ">
        <div className="flex flex-col md:flex-row justify-between gap-2 px-5 pt-5">
          <div className="md:w-[75%] flex">
            <div className="mx-auto p-5 w-full bg-white shadow-sm shadow-slate-400">
              <div className="flex gap-2 mb-5 text-start text-lg font-semibold">
                <MdSettingsSuggest className="my-auto text-3xl" />
                <h3 className=" text-xl my-auto truncate">
                  {data?.impactedEntities[0].name} {data?.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-10">
                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Problem Id
                  </h3>
                  <h3 className=" text-start text-sm ">{data?.displayId}</h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Detected Time
                  </h3>
                  <h3 className=" text-start text-sm">
                    {data && formatDateToCustomFormat(data?.startTime)}
                  </h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Analysis End Date
                  </h3>
                  <h3 className=" text-start text-sm">
                    {data &&
                      (data?.endTime == "-1"
                        ? "-"
                        : formatDateToCustomFormat(data?.endTime))}
                  </h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Total Down Time
                  </h3>
                  <h3 className=" text-start text-sm text-orange-400">
                    {data && getDownTime()}
                  </h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Impact Level
                  </h3>
                  <h3 className=" text-start text-sm">{data?.impactLevel}</h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Severity Level
                  </h3>
                  <h3 className=" text-start text-sm">{data?.severityLevel}</h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">Status</h3>
                  <h3
                    className={` text-start font-semibold text-sm ${
                      data?.status == "CLOSED"
                        ? "text-green-800"
                        : "text-red-500"
                    }`}
                  >
                    {data?.status}
                  </h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Root Cause ID
                  </h3>
                  <h3 className=" text-start text-sm">
                    {data?.rootCauseEntity?.entityId?.id || "-"}
                  </h3>
                </div>

                <div className="md:w-[25%]">
                  <h3 className="text-start text-xs font-semibold">
                    Entity Name
                  </h3>
                  <h3 className=" text-start text-sm">
                    {data?.rootCauseEntity?.name || "-"}
                  </h3>
                </div>

                <div className="w-[100%]">
                  <h3 className="text-start text-xs font-semibold">
                    Problem description
                  </h3>
                  <h3 className=" text-start text-sm truncate">
                    {
                      data?.evidenceDetails?.details[0]?.data?.properties[0]
                        .value
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-[25%] flex">
            <div className="mx-auto p-5 w-full bg-white shadow-sm shadow-slate-400">
              <div className="flex flex-col justify-between gap-5 w-full">
                <div className="flex justify-start gap-2">
                  <div className=" flex w-16 h-16 rounded-md border border-black">
                    <IoIosApps className=" text-3xl m-auto " />
                  </div>
                  <div>
                    <h3 className=" text-xs font-semibold text-start">
                      Affected applications
                    </h3>
                    <p className="text-start">
                      {data?.impactLevel === "APPLICATIONS"
                        ? data?.affectedEntities.length
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start gap-2">
                  <div className=" flex w-16 h-16 rounded-md border border-black">
                    <GrServices className=" text-3xl m-auto " />
                  </div>
                  <div>
                    <h3 className=" text-xs font-semibold text-start">
                      Affected services
                    </h3>
                    <p className="text-start">
                      {data?.impactLevel === "SERVICES"
                        ? data?.affectedEntities.length
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start gap-2">
                  <div className=" flex w-16 h-16 rounded-md border border-black">
                    <FaServer className=" text-3xl m-auto " />
                  </div>
                  <div>
                    <h3 className=" text-xs font-semibold text-start">
                      Affected infrastructure
                    </h3>
                    <p className="text-start">
                      {data?.impactLevel === "INFRASTRUCTURE"
                        ? data?.affectedEntities.length
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 px-5 py-2 gap-2">
          Last 6 hrs history
          <div>
            {lastSixHourIncidents && (
              <table className="w-full bg-white overflow-hidden shadow-sm shadow-slate-400 text-sm text-left rtl:text-right">
                <thead className="text-xs bg-slate-200 uppercase">
                  <tr>
                    <th className="px-6 py-3">Incident Reference</th>
                    <th className="px-6 py-3">Incident Title</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Start Time</th>
                    <th className="px-6 py-3">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSixHourIncidents?.data?.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 text-start">{item.problemTitle}</td>
                      <td className="p-2 text-start">{item.problemTitle}</td>
                      <td className="p-2 text-start">{item.status}</td>
                      <td className="p-2 text-start">
                        {formatDateToCustomFormat(item.problemDetectedAt)}
                      </td>
                      <td className="p-2 text-start">
                        {formatDateToCustomFormat(item.problemEndAt)}
                      </td>
                    </tr>
                  ))}
                  {lastSixHourIncidents?.data?.length === 0 && "No data"}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <table className="w-full bg-white overflow-hidden shadow-sm shadow-slate-400 text-sm text-left rtl:text-right">
              <thead className="text-xs bg-slate-300 uppercase">
                <tr>
                  <th className="px-6 py-3">Change Reference</th>
                  <th className="px-6 py-3"> Change Description</th>
                  <th className="px-6 py-3">Outage Type</th>
                  <th className="px-6 py-3">Start Time</th>
                  <th className="px-6 py-3">End Time</th>
                </tr>
              </thead>
              <tbody>
                {changes?.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 text-start">{item.ChangeReference}</td>
                    <td className="p-2 text-start">{item.ChangeDescription}</td>
                    <td className="p-2 text-start">
                      {item.OutageType || "N/A"}
                    </td>
                    <td className="p-2 text-start">{item.StartTime}</td>
                    <td className="p-2 text-start">{item.EndTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {apiData ? (
          <div className="px-5 pt-5 h-[50%]">
            <h3 className="text-lg font-semibold text-start">
              Remediation Details
            </h3>
            <div className="py-2 w-full">
              <div className="w-full bg-white overflow-hidden shadow-sm shadow-slate-400 text-sm text-left rtl:text-right text-gray-500">
                {apiData?.map((item, index) => (
                  <div
                    key={index}
                    className="border-b hover:bg-gray-50 p-4 flex flex-col space-y-2"
                  >
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Problem Title:
                      </span>
                      <span className="text-gray-600">{item.problemTitle}</span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Recommendation:
                      </span>
                      <span className="text-gray-600">
                        {item.recommendationText}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Service Name:
                      </span>
                      <span className="text-gray-600">{item.serviceName}</span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Sub Problem Title:
                      </span>
                      <span className="text-gray-600">
                        {item.subProblemTitle}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Remediation Start Time:
                      </span>
                      <span className="text-gray-600">
                        {item.scriptExecutionStartAt}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Remediation End Time:
                      </span>
                      <span className="text-gray-600">{item.problemEndAt}</span>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-700">
                        Script Path:
                      </span>
                      <span className="text-gray-600">{item.scriptPath}</span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="edit-button text-gray-600"
                        onClick={() => {
                          navigate(
                            `/recommendation/${item.remediationId}/${item.problemId}`
                          );
                        }}
                      >
                        <FaEdit className="text-2xl hover:text-gray-800" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white flex m-5 rounded-md shadow-sm shadow-slate-400 p-5 h-full">
            <div className="m-auto flex flex-col justify-center">
              <h3>Remediation required for this problem.</h3>
              <h3 className="m-1 p-2 text-sm bg-gray-800 rounded-lg text-white">
                Create Remediation
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProblemDetail;
