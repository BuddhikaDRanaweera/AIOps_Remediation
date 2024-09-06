import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";

const ExecutionHistory = () => {
  const { isLoading, error, data: apiData, getData } = useFetch_GET();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData("/get_audit_data");
  }, []);

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
    if (!start || !end) {
      return "N/A";
    } else {
      const durationInMinutes = Math.floor((new Date(end) - new Date(start)) / 60000);
      return `${durationInMinutes} min`;
    }
  };

  return (
    <div className="p-5">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Remediation Execution Records</h2>
          <p>View the execution history of remediation actions.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm outline-none p-2.5"
            id="remediation-filter"
            onChange={handleServiceFilterChange}
          >
            <option value="">Filter by Service Name</option>
            <option value="apache2">Apache2</option>
            <option value="OneAgent">OneAgent</option>
            <option value="MySQL">MySQL</option>
          </select>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm outline-none p-2.5"
            id="status-filter"
            onChange={handleStatusFilterChange}
          >
            <option value="">Filter by Status</option>
            <option value="CLOSED">Closed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="px-5 py-2 w-full h-[calc(100vh-190px)] overflow-auto">
        <div className="hidden md:block">
          <table className="w-full bg-white shadow-sm text-sm text-left">
            <thead className="bg-gray-200 text-xs">
              <tr>
                <th className="p-3 text-center">DisplayID</th>
                <th className="p-3 text-center">Problem Title</th>
                {/* <th className="p-3 text-center">Sub Problem Title</th> */}
                <th className="p-3 text-center">Problem Impact</th>
                <th className="p-3 text-center">Problem Severity</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Service Name</th>
                <th className="p-3 text-center">Actual Downtime</th>
                <th className="p-3 text-center">Action Type</th>
                {/* <th className="p-3 text-center">Comment</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => (
                <tr
                  className="hover:bg-gray-50"
                  key={item.ID}
                  onClick={() =>
                    navigate(`/${item.pid}/${item.executedProblemId}`)
                  }
                >
                  <td className="p-2 text-center">{item.displayId}</td>
                  <td className="p-2 text-center truncate">{item.problemTitle}</td>
                  {/* <td className="p-2 text-center truncate">{item.subProblemTitle || "N/A"}</td> */}
                  <td className="p-2 text-center">{item.problemImpact}</td>
                  <td className="p-2 text-center">{item.problemSeverity}</td>
                  <td className="p-2 text-center">{item.status}</td>
                  <td className="p-2 text-start">{item.serviceName}</td>
                  <td className="p-2 text-center">{calculateDuration(item.problemDetectedAt, item.problemEndAt)}</td>
                  <td className="p-2 text-center">{item.actionType.toUpperCase()}</td>
                  {/* <td className="p-2 text-center truncate">{item.comments}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredData?.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white  shadow-md border hover:bg-gray-50"
              onClick={() => navigate(`/${item.pid}/${item.executedProblemId}`)}
            >
              <p className="text-sm text-gray-600">ID: {item.displayId}</p>
              <p className="text-sm font-semibold text-gray-800 truncate">Title: {item.problemTitle}</p>
              <p className="text-sm text-gray-600 truncate">Sub Title: {item.subProblemTitle || "N/A"}</p>
              <p className="text-sm text-gray-600">Impact: {item.problemImpact}</p>
              <p className="text-sm text-gray-600">Severity: {item.problemSeverity}</p>
              <p className="text-sm text-gray-600 truncate">Service: {item.serviceName}</p>
              <p className="text-sm text-gray-600">Status: {item.status}</p>
              <p className="text-sm text-gray-600">Downtime: {calculateDuration(item.problemDetectedAt, item.problemEndAt)} min</p>
              <p className="text-sm text-gray-600">Action: {item.actionType.toUpperCase()}</p>
              <p className="text-sm text-gray-600 truncate">Comment: {item.comments}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionHistory;
