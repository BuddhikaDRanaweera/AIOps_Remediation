import React, { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { SlSizeFullscreen } from "react-icons/sl";
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
import DateRange from "../../components/date-range/DateRange";
import { convertToIST } from "../../util/helper-func/DateConverter";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const Metrics = () => {
  const [onholdStageMetrics, setOnholdStageMetrics] = useState();
  const [refreshOnhoald, setRefreshOnhoald] = useState(false);
  const [
    refreshImplementationStageMetrics,
    setRefreshImplementationStageMetrics,
  ] = useState(false);
  const baseDTUrl = process.env.REACT_APP_DT_BASE_URL;
  const apiKey = process.env.REACT_APP_DT_TOKEN;
  const [onholdStageMetricsView, setOnholdStageMetricsView] = useState();

  const [implementationStageMetrics, setImplementationStageMetrics] =
    useState();
  const [implementationStageMetricsView, setImplementationStageMetricsView] =
    useState();

  const [recentMetricsView, setRecentMetricsView] = useState();
  const replaceNullWithZero = (arr) => {
    return arr?.map((item) => (item === null ? 0 : item));
  };

  const convertTimestamps = (arr) => {
    return arr?.map((timestamp) => {
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
    const fetchDataMetrics = async () => {
      try {
        const response = await axios.get(
          `${baseDTUrl}/api/v2/metrics/query?metricSelector=log.OnholdStageMetric&resolution=10m&from=now-1d&to=now&entitySelector: type("HOST")`,
          {
            params: {
              "Api-Token": apiKey,
              // "dt0c01.POCZ4VADXFFGNIJD675DREU7.IPHH2YGQ346FC6K6YTMPOMIJN2MC7C2MSUJXWVZRJ5IEDIVRMSX2FIFP77G6XO6C",
            },
          }
        );

        const Stuck_Order_Onhold_Stage = response?.data?.result[0]?.data[0];
        // console.log(Stuck_Order_Onhold_Stage, "Metrics data");
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
    fetchDataMetrics();
  }, [refreshOnhoald]);
  useEffect(() => {
    const fetchDataMetrics = async () => {
      try {
        const response = await axios.get(
          `${baseDTUrl}/api/v2/metrics/query?metricSelector=log.ImplementationStageMetric&resolution=10m&from=now-1d&to=now&entitySelector:`,
          {
            params: {
              "Api-Token": apiKey
                // "dt0c01.POCZ4VADXFFGNIJD675DREU7.IPHH2YGQ346FC6K6YTMPOMIJN2MC7C2MSUJXWVZRJ5IEDIVRMSX2FIFP77G6XO6C",
            },
          }
        );
        // console.log(response?.data, "Metrics data 2");
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
  }, [refreshImplementationStageMetrics]);
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
            label: "On hold",
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
            label: "Implementation stage",
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

  const [editorHtml, setEditorHtml] = useState();

  const handleChange = (html) => {
    setEditorHtml(html);
  };
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // Formatting options
      ["bullet"], // Bullet points
    ],
  };

  return (
    <div className="p-3">
      <h3 className="text-lg font-semibold mb-2">Anomaly Metrics</h3>

      <div className="flex flex-col md:grid grid-cols-3 gap-2">
        <div className="bg-white shadow-sm shadow-slate-200 flex flex-col gap-2">
          <div className="flex justify-between p-2">
            <div>
              <h3 className="font-thin text-sm">On hold stage metric</h3>
            </div>
            <div className="my-auto flex justify-end gap-2">
              <h3
                onClick={() => {
                  setOnholdStageMetricsView(null);
                  setRefreshOnhoald((prev) => !prev);
                }}
                className=" text-xl hover:text-orange-700 my-auto hover:scale-110"
              >
                <IoMdRefresh />
              </h3>
              <h3
                onClick={() => {
                  setRecentMetricsView((prev) => onholdStageMetricsView);
                }}
                className=" text-sm font-semibold my-auto hover:text-orange-700 hover:scale-110"
              >
                <SlSizeFullscreen />
              </h3>
            </div>
          </div>
          <div>
            {onholdStageMetricsView && <Line data={onholdStageMetricsView} />}
          </div>
        </div>
        <div className="bg-white shadow-sm shadow-slate-200 flex flex-col gap-2">
          <div className="flex justify-between p-2">
            <div>
              <h3 className=" font-thin text-sm">
                Implementation stage metric
              </h3>
            </div>
            <div className="my-auto flex justify-end gap-2">
              <h3
                onClick={() => {
                  setImplementationStageMetricsView(null);
                  setRefreshImplementationStageMetrics((prev) => !prev);
                }}
                className=" text-xl hover:text-orange-700 my-auto hover:scale-110"
              >
                <IoMdRefresh />
              </h3>
              <h3
                onClick={() => {
                  setRecentMetricsView(
                    (prev) => implementationStageMetricsView
                  );
                }}
                className=" text-sm font-semibold my-auto hover:text-orange-700 hover:scale-110"
              >
                <SlSizeFullscreen />
              </h3>
            </div>
          </div>
          <div>
            {implementationStageMetricsView && (
              <Line data={implementationStageMetricsView} />
            )}
          </div>
        </div>
      </div>
      {recentMetricsView && (
        <div
          onClick={() => setRecentMetricsView(null)}
          className="bg-blur flex h-lvh justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50  items-center w-full md:inset-0 p-2   max-h-full"
        >
          <div className="m-auto  relative  w-full md:w-[80%]  max-h-full overflow-hidden bg-white shadow-sm shadow-slate-400">
            {recentMetricsView && <Line data={recentMetricsView} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
