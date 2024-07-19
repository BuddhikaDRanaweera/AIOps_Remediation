import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProblem } from "../../app/features/problem/ProblemSlice";


const RemidiationForm = ({ data }) => {
  const problem = useSelector((state) => state.problem);
  const selectedproblem = useSelector((state) => state.selectedproblem.selectedproblem);
  // const { isLoading, error, data, postData } = useFetch_POST();


  useEffect(() => {
  setSelectedProblem({ main: selectedProblem?.title, sub: selectedproblem?.serviceName });
  },[selectedproblem])
  
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
      // console.log(
      //   filteredSubProblems[0],
      //   filteredSubProblems[1],
      //   filteredSubProblems[2]
      // );
    } else {
      setSubProblems([]);
    }
  }, [selectedProblem.main, data, selectedproblem]);

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
    <div className=" bg-white w-full h-[550px] rounded-md overflow-auto">
      <div className="flex justify-start bg-main">
        <h3 className="text-white p-2">Active Problem</h3>
      </div>

      <div className="flex justify-center gap-5 mt-20 p-10">
        <div className="w-[40%]">
          <div className="flex flex-col">
            <label
              for="default"
              className="flex justify-start mb-1 text-sm font-medium text-gray-900"
            >
              Problem Title:
            </label>
            <select
              id="problem-title"
              onChange={handleProblemChange}
              value={selectedproblem ? selectedproblem.title : selectedProblem.main}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
            >
              <option disabled value="">
                Select Problem
              </option>
              {Array.from(
                new Set(data?.map((problem) => problem.problemTitle))
              ).map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              for="default"
              className="flex justify-start mb-1 text-sm font-medium text-gray-900"
            >
              Sub-Problem:
            </label>
            <select
              id="sub-problem"
              onChange={handleSubProblemChange}
              value={selectedproblem ? selectedproblem.serviceName : problem.ServiceName}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
            >
              <option value={''}>Select Service</option>
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

          <div className="flex flex-col">
            <label
              for="default"
              className="flex justify-start mb-1 text-sm font-medium text-gray-900"
            >
              Recommendation:
            </label>
            <select
              id="sub-problem"
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
            >
              <option disabled>Select Recommendation</option>
              {["Recommendation 1", "Recommendation 2", "Recommendation 3"].map(
                (item, index) => (
                  <option key={index}>{item}</option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="w-[40%] flex flex-col justify-center gap-5">
          <div className="mx-auto w-full">
            <div
              className=" hover:bg-main w-full p-5 rounded-md text-main border border-main hover:text-white shadow-sm shadow-slate-400"
              onClick={() => {
                navigateTo("/assisted-analysis");
              }}
            >
              <i class="fa-solid fa-chart-line text-4xl"></i>
              <p className="active-problem-option-title">
                <strong>Assisted Analysis</strong>
              </p>
            </div>
          </div>
          <div className="mx-auto w-full">
            <div
              className=" hover:bg-main w-full p-5 rounded-md text-main border border-main hover:text-white shadow-sm shadow-slate-400"
              onClick={() => {
                navigateTo("/build-solution");
              }}
            >
              <i class="fa-solid fa-puzzle-piece text-4xl"></i>
              <p className="active-problem-option-title">
                <strong>Build Solution</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemidiationForm;
