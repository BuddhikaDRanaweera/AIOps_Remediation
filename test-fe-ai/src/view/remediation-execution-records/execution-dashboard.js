import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
import "./execution-dashboard.css";

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
      <div className="table-header">
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
      </div>
      <div className="container">
        <table id="execution-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DisplayID</th>
              <th>Problem Title</th>
              <th>Sub Problem Title</th>
              <th>Impacted Entity</th>
              <th>Problem Impact</th>
              <th>Problem Severity</th>
              <th>Status</th>
              <th>Service Name</th>
              <th>Problem Detected At</th>
              <th>Problem End At</th>
              <th>Downtime</th>
              <th>Action Type</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item) => (
              <tr
                key={item.ID}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/${item.pid}/${item.executedProblemId}`)
                }
              >
                <td>{item.id}</td>
                <td>{item.displayId}</td>
                <td>{item.problemTitle}</td>
                <td>{item.subProblemTitle || "N/A"}</td>
                <td>{item.impactedEntity}</td>
                <td>{item.problemImpact}</td>
                <td>{item.problemSeverity}</td>
                <td>{item.status}</td>
                <td>{item.serviceName}</td>
                <td>{item.problemDetectedAt}</td>
                <td>{item?.problemEndAt || "N/A"}</td>
                <td>
                  {calculateDuration(
                    item?.problemDetectedAt,
                    item?.problemEndAt
                  )}{" "}
                  min
                </td>
                <td>{item.actionType.toUpperCase()}</td>
                <td>{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionHistory;
