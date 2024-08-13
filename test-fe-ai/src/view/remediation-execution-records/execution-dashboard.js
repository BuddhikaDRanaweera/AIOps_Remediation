import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
// import "./execution-dashboard.css";

const ExecutionHistory = () => {
  const { isLoading, error, data: apiData, getData } = useFetch_GET();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getData("/get_audit_data");
  }, []);
  console.log(data);
  useEffect(() => {
    setData(apiData);
    setFilteredData(apiData);
  }, [apiData]);

  const handleServiceFilterChange = (event) => {
    const value = event.target.value;
    setFilteredData(
      value ? data.filter((item) => item.serviceName === value) : data
    );
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setFilteredData(
      value ? data.filter((item) => item.status === value) : data
    );
  };
  const calculateDuration = (start, end) => {
    if (start == null || end == null) {
      return "N/A";
    } else {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const durationInMilliseconds = endDate - startDate;
      const durationInMinutes = Math.floor(durationInMilliseconds / 60000);
      return durationInMinutes;
    }
  };
  return (
    <div>
      {/* <div className="table-header">
        <div className="table-name-description">
          <h2 className="table-name">Remediation Execution Records</h2>
          <p className="execution-table-description">
            View the execution history of remediation actions.
          </p>
        </div>
        <div className="filters">
          <select id="remediation-filter" onChange={handleServiceFilterChange}>
            <option value="">Filter by Service Name</option>
            <option value="apache2">Apache2</option>
            <option value="OneAgent">OneAgent</option>
            <option value="MySQL">MySQL</option>
          </select>
          <select id="status-filter" onChange={handleStatusFilterChange}>
            <option value="">Filter by Status</option>
            <option value="CLOSED">Closed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div> */}

      <div className="flex justify-between">
        <div className="p-5">
        <h2 className="text-start text-xl font-semibold">Remediation Execution Records</h2>
          <p className="text-start">
            View the execution history of remediation actions.
          </p>
        </div>
        <div className="flex justify-end gap-5 px-5">
           <div className="my-auto">
           <select className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm outline-none block w-full p-2.5" id="remediation-filter" onChange={handleServiceFilterChange}>
            <option value="">Filter by Service Name</option>
            <option value="apache2">Apache2</option>
            <option value="OneAgent">OneAgent</option>
            <option value="MySQL">MySQL</option>
          </select>
           </div>
           <div className="my-auto">
           <select className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm outline-none block w-full p-2.5"id="status-filter" onChange={handleStatusFilterChange}>
            <option value="">Filter by Status</option>
            <option value="CLOSED">Closed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
          </select>
           </div>
        </div>
      </div>
      <div className="px-5 h-[calc(100vh-180px)] overflow-auto">
        <table className="w-full bg-white overflow-hidden shadow-sm shadow-slate-400 text-sm text-left rtl:text-right ">
        <thead className="text-xs bg-slate-300 uppercase">
            <tr >
              {/* <th>ID</th> */}
              <th className="p-3 text-center">DisplayID</th>
              <th className="p-3 text-center">Problem Title</th>
              <th className="p-3 text-center">Sub Problem Title</th>
              {/* <th>Impacted Entity</th> */}
              <th className="p-3 text-center">Problem Impact</th>
              <th className="p-3 text-center">Problem Severity</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Service Name</th>
              {/* <th>Problem Detected At</th> */}
              {/* <th>Problem End At</th> */}
              <th className="p-3 text-center">Downtime</th>
              <th className="p-3 text-center">Action Type</th>
              <th className="p-3 text-center">Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item) => (
              <tr
                className=" hover:bg-slate-100"
                key={item.ID}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/${item.pid}/${item.executedProblemId}`)
                }
              >
                {/* <td>{item.id}</td> */}
                <td className="p-2 text-center">{item.displayId}</td>
                <td className="p-2 text-center">{item.problemTitle}</td>
                <td className="p-2 text-center">{item.subProblemTitle || "N/A"}</td>
                {/* <td>{item.impactedEntity}</td> */}
                <td className="p-2 text-center">{item.problemImpact}</td>
                <td className="p-2 text-center">{item.problemSeverity}</td>
                <td className="p-2 text-center">{item.status}</td>
                <td className="p-2 text-center">{item.serviceName}</td>
                {/* <td>{item.problemDetectedAt}</td> */}
                {/* <td>{item?.problemEndAt || "N/A"}</td> */}
                <td className="p-2 text-center">
                  {calculateDuration(
                    item?.problemDetectedAt,
                    item?.problemEndAt
                  )}{" "}
                  min
                </td>
                <td className="p-2 text-center">{item.actionType.toUpperCase()}</td>
                <td className="p-2 text-center">{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionHistory;
