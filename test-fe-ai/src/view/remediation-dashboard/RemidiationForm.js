import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProblem } from "../../app/features/problem/ProblemSlice";
import "./RemidiationForm.css";

const RemidiationForm = ({ data }) => {
  const problem = useSelector((state) => state.problem);
  // const { isLoading, error, data, postData } = useFetch_POST();

  useEffect(() => {
    console.log(problem, "jjsjsj");
  }, [problem]);
  const navigate = useNavigate();
  const navigateTo = (url) => {
    navigate(url);
  };
  const [selectedProblem, setSelectedProblem] = useState({
    main: "",
    sub: "",
    id: "",
  });
  const [subProblems, setSubProblems] = useState([]);

  // const onSubmitData = (data) => {
  //   onSubmit(data);
  // };
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedProblem.main) {
      // console.log(data);
      const filteredSubProblems = data
        .filter(
          (item) =>
            item.problemTitle === selectedProblem.main && item.subProblemTitle
        )
        .map((item) => [item.subProblemTitle, item.id, item.serviceName]);
      setSubProblems(filteredSubProblems);
      console.log(
        filteredSubProblems[0],
        filteredSubProblems[1],
        filteredSubProblems[2]
      );
    } else {
      setSubProblems([]);
    }
  }, [selectedProblem.main, data]);

  const handleProblemChange = (event) => {
    setSelectedProblem({ main: event.target.value, sub: "" });
  };

  const handleSubProblemChange = (event) => {
    const [subproblemname, problemId, serviceName] = JSON.parse(
      event.target.value
    );

    console.log(subproblemname, problemId, serviceName);

    let main = selectedProblem.main;
    dispatch(setProblem({ main, subproblemname, problemId, serviceName }));
  };

  return (
    <div className="right-panel m-2">
      <div className="bg-main text-white p-2 text-start font-semibold">
        Active Problem
      </div>

      <div>
        <div className="form-value">
          <div style={{ width: "20%", marginTop: "10px" }}>
            <p className="recommendation-title">
              <strong>Problem Title: </strong>
            </p>
          </div>
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "start",
              marginTop: "10px",
            }}
          >
            <select
              id="problem-title"
              className="right-panel-input-box"
              onChange={handleProblemChange}
              value={selectedProblem.main}
            >
              <option value="">Select Problem</option>
              {Array.from(
                new Set(data?.map((problem) => problem.problemTitle))
              ).map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-value">
          <div style={{ width: "20%", marginTop: "5px" }}>
            <p className="recommendation-title">
              <strong>Sub-Problem: </strong>
            </p>
          </div>
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "start",
              marginTop: "5px",
            }}
          >
            <select
              id="sub-problem"
              className="right-panel-input-box"
              onChange={handleSubProblemChange}
              value={problem.ServiceName}
            >
              <option>Select Service</option>
              {subProblems.map(([subProblemName, id, ServiceName], index) => (
                <option
                  key={index}
                  value={JSON.stringify([subProblemName, id, ServiceName])}
                >
                  {ServiceName + " Service"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-value">
          <div style={{ width: "20%", marginTop: "5px" }}>
            <p className="recommendation-title">
              <strong>Recommendation: </strong>
            </p>
          </div>
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "start",
              marginTop: "5px",
            }}
          >
            <div className="right-panel-input-box">
              <div class="checkbox-container">
                <input
                  type="checkbox"
                  id="recommendation1"
                  name="recommendation"
                  value="Recommendation1"
                />
                <label htmlFor="recommendation1">Recommendation 1</label>
              </div>
              <br />
              <div class="checkbox-container">
                <input
                  type="checkbox"
                  id="recommendation2"
                  name="recommendation"
                  value="Recommendation2"
                />
                <label htmlFor="recommendation2">Recommendation 2</label>
              </div>
              <br />
              <div class="checkbox-container">
                <input
                  type="checkbox"
                  id="recommendation3"
                  name="recommendation"
                  value="Recommendation3"
                />
                <label htmlFor="recommendation3">Recommendation 3</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="active-problem-manage-option">
        <div className="option-assisted-analysis">
          <div
            className="option-assisted-analysis-text"
            onClick={() => {
              navigateTo("/assisted-analysis");
            }}
          >
            <i class="fa-solid fa-chart-line"></i>
            <p className="active-problem-option-title">
              <strong>Assisted Analysis</strong>
            </p>
          </div>
        </div>
        <div className="option-build-solution">
          <div
            className="option-build-solution-text"
            onClick={() => {
              navigateTo("/build-solution");
            }}
          >
            <i class="fa-solid fa-puzzle-piece"></i>
            <p className="active-problem-option-title">
              <strong>Build Solution</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemidiationForm;
