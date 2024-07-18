/* import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProblem } from "../../app/features/problem/ProblemSlice";

const ProblemForm = ({ data, onSubmit }) => {
  console.log(data, "ALL");
  const [selectedProblem, setSelectedProblem] = useState({
    main: "",
    sub: "",
    id: "",
  });
  const [subProblems, setSubProblems] = useState([]);
  const onSubmitData = (data) => {
    onSubmit(data);
  };
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
    <div>
      <div className="form-group">
        <label htmlFor="problem-title" className="label-class">
          Problem Title:
        </label>
        <select
          id="problem-title"
          className="problem-input-box"
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
      <div className="form-group">
        <label htmlFor="sub-problem" className="label-class">
          Service:
        </label>
        <select
          id="sub-problem"
          className="problem-input-box"
          onChange={handleSubProblemChange}
          value={JSON.stringify([
            selectedProblem.sub,
            subProblems.find((sub) => sub[0] === selectedProblem.sub)?.[1],
          ])}
        >
          <option value="">Select Service</option>
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
  );
};

export default ProblemForm;
 */