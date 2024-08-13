import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RemediationConfirmation from "../../components/modal/RemediationConfirmation";
import useFetch_GET from "../../services/http/Get";

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
      <div>
        <div className="text-start px-5 py-2">
          <h2 className="font-semibold text-lg">Remediation Records</h2>
          <p className="text-sm">View the details of remediation actions.</p>
        </div>
      </div>
      <div className="px-5 py-2 w-full h-[calc(100vh-150px)] overflow-auto">
        <div className="hidden md:block">
          <table className="w-full bg-white overflow-hidden shadow-sm shadow-slate-400 text-sm text-left rtl:text-right">
            <thead className="text-xs bg-slate-300 uppercase">
              <tr>
                <th className="px-6 py-3">ProblemId</th>
                <th className="px-6 py-3">Problem Title</th>
                <th className="px-6 py-3">Sub-problem</th>
                <th className="px-6 py-3">Resolution Script</th>
                <th className="px-6 py-3">Recommendation</th>
                <th className="px-6 py-3">Create Date</th>
                <th className="px-6 py-3">Last Update</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Edit</th>
                <th className="px-6 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 text-center">{item.problemId}</td>
                  <td className="p-2 text-start">{item.problemTitle}</td>
                  <td className="p-2 text-start">{item.subProblemTitle || "N/A"}</td>
                  <td className="p-2 text-start">{item.scriptPath}</td>
                  <td className="p-2 text-start">{item.recommendationText}</td>
                  <td className="p-2 text-start">{item.createdAt}</td>
                  <td className="p-2 text-start">{item.lastUpdateAt}</td>
                  <td className="p-2 text-start">{item.Owner} John</td>
                  <td className="p-2 text-center">
                    <button
                      className="edit-button"
                      onClick={() => {
                        navigate(`/recommendation/${item.remediationId}/${item.problemId}`);
                      }}
                    >
                      <FaEdit className="text-2xl hover:text-main" />
                    </button>
                  </td>
                  <td className="p-2 text-center">
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
                      <DeleteIcon className="text-2xl hover:text-main" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {filteredData?.map((item) => (
            <div key={item.id} className="bg-white shadow-sm shadow-slate-400 mb-4 p-4 rounded-md">
              <div className="text-sm mb-2">
                <strong>ProblemId:</strong> {item.problemId}
              </div>
              <div className="text-sm mb-2">
                <strong>Problem Title:</strong> {item.problemTitle}
              </div>
              <div className="text-sm mb-2">
                <strong>Sub-problem:</strong> {item.subProblemTitle || "N/A"}
              </div>
              <div className="text-sm mb-2">
                <strong>Resolution Script:</strong> {item.scriptPath}
              </div>
              <div className="text-sm mb-2">
                <strong>Recommendation:</strong> {item.recommendationText}
              </div>
              <div className="text-sm mb-2">
                <strong>Create Date:</strong> {item.createdAt}
              </div>
              <div className="text-sm mb-2">
                <strong>Last Update:</strong> {item.lastUpdateAt}
              </div>
              <div className="text-sm mb-2">
                <strong>Owner:</strong> {item.Owner} John
              </div>
              <div className="flex space-x-2">
                <button
                  className="edit-button flex-1"
                  onClick={() => {
                    navigate(`/recommendation/${item.remediationId}/${item.problemId}`);
                  }}
                >
                  <FaEdit className="text-2xl hover:text-main" />
                </button>
                <button
                  className="edit-button flex-1"
                  onClick={() => {
                    setOpen(true);
                    setDeleteObj({
                      problemId: item?.problemId,
                      remediationId: item.remediationId,
                    });
                  }}
                >
                  <DeleteIcon className="text-2xl hover:text-main" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RemediationTable;
