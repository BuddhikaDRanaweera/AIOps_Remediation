import React, { useEffect, useRef, useState } from "react";
import useFetch_GET from "../../services/http/Get";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";

const Timeline = () => {
  const { isLoading, error, data: apiData, getData } = useFetch_GET();

  const [data, setData] = useState();
  const { PID, ExecutionId, AuditId } = useParams();
  const baseDTUrl=process.env.REACT_APP_DT_BASE_URL
  const apiKey =process.env.REACT_APP_DT_TOKEN
  const url = `${baseDTUrl}/api/v2/problems/${PID}`;
    // "dt0c01.POCZ4VADXFFGNIJD675DREU7.IPHH2YGQ346FC6K6YTMPOMIJN2MC7C2MSUJXWVZRJ5IEDIVRMSX2FIFP77G6XO6C";

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
        // alert(error.message);
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
  const [stage, setStage] = useState(1);
  useEffect(() => {
    if (apiData) {
      const timeline = ["Detected"];
      if (apiData?.status === "OPEN") {
       setStage(prev => 2)
      } else {
        if (apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS") {
          setStage(prev => 2)
        }
        if (apiData?.preValidationStatus) {
          setStage(prev => 3)
        }
        if (apiData?.scriptExecutionStartAt !== null) {
          setStage(prev => 4)
        }
        if (apiData?.problemEndAt !== null) {
          setStage(prev => 5)
        }
        if (apiData?.postValidationStatus) {
          setStage(prev => 6)
        }
        if ( data?.status === "CLOSED") {
          setStage(prev => 7)
        }
      }
    }
  }, [apiData]);

  return (
    <>
      <h3 className="text-lg font-semibold text-start px-5 pb-5">
        Problem Timeline
      </h3>
      {apiData?.status == 'OPEN' ? (  <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
        {/* Step 1: User info */}
        <li className={`flex items-center ${stage >= 1 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
    <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 1 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 1 && <TiTick />}
    </span>
          <span>
            <h3 className="font-medium leading-tight">Step 1</h3>
            <p className="text-sm">Problem Detected</p>
          </span>
        </li>
        <li className={`flex items-center ${stage >= 2 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
    <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 2 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 2 && <TiTick />}
    </span>
          <span>
            <h3 className="font-medium leading-tight">Step 2</h3>
            <p className="text-sm">Rule Defenition Required to proceed</p>
          </span>
        </li>
      </ol>
):(  <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
  {/* Step 1: User info */}
  <li className={`flex items-center ${stage >= 1 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
    <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 1 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 1 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Step 1</h3>
      <p className="text-sm">Problem Detected</p>
    </span>
  </li>
  <li className={`flex items-center ${stage >= 2 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
  <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 2 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 2 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Step 2</h3>
      <p className="text-sm">Rule Matching</p>
    </span>
  </li>
  <li className={`flex items-center ${stage >= 3 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
  <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 3 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 3 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Step 3</h3>
      <p className="text-sm">Pre Validation</p>
    </span>
  </li>
  <li className={`flex items-center ${stage >= 4 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
  <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 4 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 4 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Step 4</h3>
      <p className="text-sm">Execution Start</p>
    </span>
  </li>
  <li className={`flex items-center ${stage >= 5 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
  <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 5 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 5 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Step 5</h3>
      <p className="text-sm">Execution End</p>
    </span>
  </li>
  <li className={`flex items-center ${stage >= 6 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
  <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 6 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 6 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Step 6</h3>
      <p className="text-sm">Post Validation</p>
    </span>
  </li>
  <li className={`flex items-center ${stage >= 7 ? 'text-green-600':'text-gray-600'} space-x-2.5 rtl:space-x-reverse`}>
  <span className={`flex items-center justify-center w-8 h-8 border ${stage >= 7 ? 'border-green-600':'border-gray-600'} rounded-full shrink-0`}>
      {stage >= 7 && <TiTick />}
    </span>
    <span>
      <h3 className="font-medium leading-tight">Closed</h3>
      {/* <p className="text-sm">Post Validation</p> */}
    </span>
  </li>
</ol>
)}
      {/* <ol class="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base">
        <li
          className={`flex w-full relative ${
            true
              ? "text-green-600 after:content-[''] after:w-full after:h-0.5 after:bg-green-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
              : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
          }`}
        >
          <div className="block whitespace-nowrap z-10">
            <span
              className={`w-6 h-6 ${"bg-green-600 border-2 border-transparent text-white"} rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
            >
              1
            </span>
            Detected
          </div>
        </li>

        <li
          className={`flex w-full relative ${
            apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS"
              ? "text-green-600 after:content-[''] after:w-full after:h-0.5 after:bg-green-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
              : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
          }`}
        >
          <div className="block whitespace-nowrap z-10">
            <span
              className={`w-6 h-6 ${
                apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS"
                  ? "bg-green-600 border-2 border-transparent text-white"
                  : apiData?.status == "OPEN"
                  ? "bg-gray-100 border-2 border-gray-300 text-gray-500"
                  : "bg-green-600 border-2 border-transparent text-white"
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
                  ? "text-green-600 after:content-[''] after:w-full after:h-0.5 after:bg-green-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
              }`}
            >
              <div className="block whitespace-nowrap z-10">
                <span
                  className={`w-6 h-6 ${
                    apiData?.problemEndAt !== null
                      ? "bg-green-600 border-2 border-transparent text-white"
                      : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                  } rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
                >
                  3
                </span>{" "}
                {apiData?.status == "CLOSED" || apiData?.status == "IN_PROGRESS"
                  ? "Execution Start"
                  : "Waiting for Rule"}
              </div>
            </li>

            <li
              className={`flex w-full relative ${
                data?.status == "CLOSED"
                  ? "text-green-600 after:content-[''] after:w-full after:h-0.5 after:bg-green-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
              }`}
            >
              <div className="block whitespace-nowrap z-10">
                <span
                  className={`w-6 h-6 ${
                    apiData?.problemEndAt !== null
                      ? "bg-green-600 border-2 border-transparent text-white"
                      : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                  } rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
                >
                  4
                </span>{" "}
                  Execution Completed
              </div>
            </li>

            <li
              className={`flex w-full relative ${
                apiData?.status === "CLOSED"
                  ? "text-green-600 after:content-[''] after:w-full after:h-0.5 after:bg-green-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
              }`}
            >
              <div className="block whitespace-nowrap z-10">
                <span
                  className={`w-6 h-6 rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10 ${
                    apiData?.status === "CLOSED" && data?.status === "CLOSED"
                      ? "bg-green-600 border-2 border-transparent text-white"
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
                    5
                  </span>
                </span>
                Validate Solution
              </div>
            </li>

            <li
              className={`flex w-full relative ${
                data?.status === "CLOSED"
                  ? "text-green-600"
                  : "text-gray-900"
              }`}
            >
              <div className="block whitespace-nowrap z-10">
                <span
                  className={`w-6 h-6 ${
                    data?.status == "CLOSED"
                      ? "bg-green-600 border-2 border-transparent text-white"
                      : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                  } rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10`}
                >
                  6
                </span>
                Closed
              </div>
            </li>
          </>
        )}
      </ol> */}
    </>
  );
};

export default Timeline;
