import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RemediationConfirmation from "../../components/modal/RemediationConfirmation";
import useFetch_GET from "../../services/http/Get";
import "./RemediationTable.css";

const RemediationTable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const { isLoading, error, data: apiData, getData } = useFetch_GET();
  const handleOpen = () => {
    setOpen(!open);
  };
  useEffect(() => {
    getData("/problems_with_remediations");
  }, [open]);
  useEffect(() => {
    setData(apiData);
    setFilteredData(apiData);
  }, [apiData]);

  const handleServiceFilterChange = (event) => {
    const value = event.target.value;
    setFilteredData(
      value ? data.filter((item) => item.ServiceName === value) : data
    );
  };

  return (
    <div>
      {open && (
        <RemediationConfirmation
          handleOpen={handleOpen}
          open={true}
          problemId={deleteObj?.problemId}
          remediationId={deleteObj?.remediationId}
        />
      )}
      <div className="table-header">
        <div>
          <h2 className="table-name">Remediation Records</h2>
          <p className="remediation-table-description">
            View the details of remediation actions.
          </p>
        </div>
        {/* <div className="filters">
          <select
            id="remediation-filter"
            onchange="handleServiceFilterChange()"
          >
            <option value="">Filter by Service Name</option>
          </select>
          <select id="status-filter" onchange={handleStatusFilterChange()}>
            <option value="">Filter by Problem</option>
            <option value="Process unavailable">Process unavailable</option>
          </select>
        </div> */}
      </div>
      <div className="container">
        <table id="execution-table">
          <thead>
            <tr>
              <th>ProblemId</th>
              <th>Problem Title</th>
              <th>Sub-problem</th>
              <th>Resolution Script</th>
              <th>Recommendation</th>
              <th>Create Date</th>
              <th>Last Update</th>
              <th>Owner</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item) => (
              <tr key={item.id}>
                <td>{item.problemId}</td>
                <td>{item.problemTitle}</td>
                <td>{item.subProblemTitle || "N/A"}</td>
                <td>{item.scriptPath}</td>
                <td>{item.recommendationText}</td>
                <td>{item.createdAt}</td>
                <td>{item.lastUpdateAt}</td>
                <td>{item.Owner} John</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate(
                        `/recommendation/${item.remediationId}/${item.problemId}`
                      );
                    }}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setOpen(true);
                      setDeleteObj({
                        problemId: item?.problemId,
                        remediationId: item.remediationId,
                      });
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RemediationTable;
