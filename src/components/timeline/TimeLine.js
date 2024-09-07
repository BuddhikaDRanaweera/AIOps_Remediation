import React, { useEffect, useRef, useState } from "react";
import useFetch_GET from "../../services/http/Get";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

const Timeline = () => {
  const { isLoading, error, data: apiData, getData } = useFetch_GET();
  const [data, setData] = useState();
  const { PID, ExecutionId, AuditId } = useParams();
  const url = `https://uag17776.live.dynatrace.com/api/v2/problems/${PID}`;
  const apiKey =
    "dt0c01.SXQEW54MQL5FLY2CNDD4SILS.AR67H437SVENVZIOOSWZ6GXFTQH5IVTS2UAT6RZ7CZ57DPITCOW7BPR34OGCTA7L";
  const halfColoredCircleLeft = {
    background: "conic-gradient(#4F46E5 50%, transparent 50%)", // Shade left side
  };

  const halfColoredCircleRight = {
    background: "conic-gradient(transparent 50%, #4F46E5 50%)", // Shade right side
  };
  const circleStyle = {
    width: "w-10 lg:w-10", 
    height: "h-10 lg:h-10",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  };
  useEffect(() => {
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
        alert(error.message);
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();

    const interval = setInterval(() => {
        fetchData();
    }, 15000); // Call every 30 seconds
    return () => {
      clearInterval(interval); // Cleanup on component unmount
    };
  }, []);

  useEffect(() => {
    getData(`/audit/${AuditId}`);

    const intervalId = setInterval(() => {
      getData(`/audit/${AuditId}`);
    }, 10000); // Call every 5 seconds
    return () => {
      clearInterval(intervalId); // Cleanup on component unmount
    };
  }, []);

  return (
    <ol class="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base">
      <li
        className={`flex w-full relative ${
          true
            ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
            : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
        }`}
      >
        <div className="block whitespace-nowrap z-10">
          <span
            className={`w-6 h-6 ${"bg-indigo-600 border-2 border-transparent text-white"} rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
          >
            1
          </span>{" "}
          Detecting
        </div>
      </li>
      <li
        className={`flex w-full relative ${
          apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS"
            ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
            : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
        }`}
      >
        <div className="block whitespace-nowrap z-10">
          <span
            className={`w-6 h-6 ${
              apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS"
                ? "bg-indigo-600 border-2 border-transparent text-white"
                : apiData?.status == "OPEN"
                ? "bg-gray-100 border-2 border-gray-300 text-gray-500"
                : "bg-indigo-600 border-2 border-transparent text-white"
            } rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
          >
            2
          </span>{" "}
          {apiData?.status === "OPEN"
            ? "Rule Defenition Required to proceed"
            : "Rule Matching"}
        </div>
      </li>
      {apiData?.status == "OPEN" ? null : (
        <>
          <li
            className={`flex w-full relative ${
              apiData?.problemEndAt !== null
                ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
            }`}
          >
            <div className="block whitespace-nowrap z-10">
              <span
                className={`w-6 h-6 ${
                  apiData?.problemEndAt !== null
                    ? "bg-indigo-600 border-2 border-transparent text-white"
                    : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                } rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
              >
                3
              </span>{" "}
              {apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS"
                ? "Execution"
                : "Waiting for Rule"}
            </div>
          </li>
          <li
            className={`flex w-full relative ${
              apiData?.status === "CLOSED"
                ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
            }`}
          >
            <div className="block whitespace-nowrap z-10">
              <span
                className={`w-6 h-6 rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10 ${
                  apiData?.status === "CLOSED" && data?.status === "CLOSED"
                    ? "bg-indigo-600 border-2 border-transparent text-white"
                    : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                }`}
                style={
                  data?.status !== "CLOSED" && apiData?.status === "CLOSED"
                    ? { ...halfColoredCircleRight, ...circleStyle }
                    : circleStyle
                }
              >
                <span
                  style={{
                    color: apiData?.status === "CLOSED" ? "#fff" : "#4F46E5",
                  }}
                >
                  4
                </span>
              </span>{" "}
              Verification
            </div>
          </li>

          <li class="flex w-full relative text-indigo-900  ">
            <div class="block whitespace-nowrap z-10">
              <span
                className={`w-6 h-6 ${
                  data?.status == "CLOSED"
                    ? "bg-indigo-600 border-2 border-transparent text-white"
                    : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                } rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
              >
                5
              </span>
              Closed
            </div>
          </li>
        </>
      )}
    </ol>
  );
};

export default Timeline;
