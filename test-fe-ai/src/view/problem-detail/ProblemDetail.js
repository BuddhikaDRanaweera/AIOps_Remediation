import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPenClip } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearGlobalLoading,
  setGlobalLoading,
} from "../../app/features/loading/LoadingSlice";
import ProblemOverviewCard from "../../components/cards/ProblemOverviewCard";
import useFetch_GET from "../../services/http/Get";
import "./ProblemDetail.css";

const ProblemDetail = () => {
  const { PID, ExecutionId } = useParams();
  const { isLoading, error, data: apiData, getData } = useFetch_GET();
  console.log(PID);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState();
  console.log(apiData);
  const url = `https://zvq81199.live.dynatrace.com/api/v2/problems/${PID}`;
  const apiKey =
    "dt0c01.LR6CLRORJDDG566FNMMHLZ3M.VRNMEMKK4OSEQGVYJ4YFPK7KIBXV7IFZGFMODWOSNQHODGSHCSELGCQ7XSJBGF67";

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

  useEffect(() => {
    dispatch(setGlobalLoading({ loading: true }));

    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          params: {
            "Api-Token": apiKey,
          },
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        alert(error.message);
        console.error("Error fetching data: ", error);
      } finally {
        dispatch(clearGlobalLoading());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getData(`/problem_recommendations/${ExecutionId}/${PID}`);
  }, [data]);
  return (
    <div>
      {/* Row 1 */}
      <div className="problem-id">
        <strong>ID: </strong>
        <label id="displayId" name="displayId">
          {data?.displayId}
        </label>
      </div>
      <section className="section">
        <div className="two-column-layout">
          <TableContainer component={Paper} sx={{ maxWidth: "40%" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none", width: "30%" }}>
                    <strong>Title:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", width: "75%" }}>
                    {data?.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Problem ID:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data?.displayId}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Problem Detected Time:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data && getDate(data?.startTime)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Problem Analysis End Date:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data &&
                      (data?.endTime == "-1" ? "-" : getDate(data?.endTime))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Total Down Time:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data && getDownTime()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Impact Level:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data?.impactLevel}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Severity Level:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data?.severityLevel}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Status:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data?.status}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Root Cause ID:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data?.rootCauseEntity?.entityId?.id || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <strong>Entity Name:</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {data?.rootCauseEntity?.name || "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div className="additional-content">
            {/* Add your additional content here */}
            <ProblemOverviewCard data={data} />
            {/* <ImpactedCardComponent data={data} /> */}
          </div>
        </div>
      </section>

      {/* <section className="section-2">
        <div className="affected-sections">
          <div className="affected-section">
            <div className="section-content">
              <img
                src={applicationsIcon}
                alt="Applications Icon"
                width="24"
                height="24"
              />
              <label htmlfor="title">
                <strong>Affected applications:</strong>
              </label>
            </div>
            <div className="section-label">
              <p>
                <b>ID:</b> {data?.affectedEntities[0].entityId.id}
              </p>
              <p>
                <b>Type:</b> {data?.affectedEntities[0].entityId.type}
              </p>
              <p>
                <b>Name:</b> {data?.affectedEntities[0].name}
              </p>
            </div>
          </div>
          <div className="affected-section">
            <div className="section-content">
              <img
                src={servicesIcon}
                alt="Services Icon"
                width="24"
                height="24"
              />
              <label htmlfor="title">
                <strong>Affected services:</strong>
              </label>
            </div>
            <div className="section-label">
              <p>ID: Type:</p>
              <p>Name</p>
            </div>
          </div>
          <div className="affected-section">
            <div className="section-content">
              <img
                src={infrastructureIcon}
                alt="Infrastructure Icon"
                width="24"
                height="24"
              />
              <label htmlfor="title">
                <strong>Affected infrastructure:</strong>
              </label>
            </div>
            <div className="section-label">
              <p>ID: Type:</p>
              <p>Name</p>
            </div>
          </div>
        </div>
      </section> */}
      <section className="section-3">
        <h3>Remediation Details</h3>
        <br />
        <div className="table-container">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Problem Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Recommendation</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Service Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Sub Problem Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Remediation Execution Start Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Remediation Execution End Time</strong>
                  </TableCell>
                  {/* <TableCell>ID</TableCell> */}
                  <TableCell>
                    <strong>Script Path</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Edit</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiData?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.problemTitle}</TableCell>
                    <TableCell>{item.recommendationText}</TableCell>
                    <TableCell>{item.serviceName}</TableCell>
                    <TableCell>{item.subProblemTitle}</TableCell>
                    <TableCell>{item.scriptExecutionStartAt}</TableCell>
                    <TableCell>{item.problemEndAt}</TableCell>
                    <TableCell>{item.scriptPath}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          navigate(
                            `/recommendation/${item.remediationId}/${item.problemId}`
                          );
                        }}
                      >
                        <FaPenClip />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
    </div>
  );
};

export default ProblemDetail;
