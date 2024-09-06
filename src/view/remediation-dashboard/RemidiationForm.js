import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProblem } from "../../app/features/problem/ProblemSlice";
import useFetch_GET from "../../services/http/Get";

const RemidiationForm = ({ data }) => {
  const problemTitle = useSelector((state) => state.problem.problemTitle);
  const subProblemTitle = useSelector((state) => state.problem.subProblemTitle);
  const { isLoading, error, data:recentProblems, getData } = useFetch_GET();



  useEffect(()=>{
    getData("/audit-status");
    
  },[]);
  if(recentProblems)
    console.log(recentProblems,">>>>>>>");
  const [pId, setPId] = useState('')

  useEffect(()=>{
    if(problemTitle){
      console.log(problemTitle, 'kkk')
      setSelectedProblem((prev) => problemTitle);
    }
  },[problemTitle]);

  useEffect(()=>{
    console.log(subProblemTitle,"subProblemTitle");
    if(subProblemTitle && recentProblems){
      
      console.log(subProblemTitle, 'mils');
      console.log(recentProblems,'oo');
      const filter = recentProblems?.activity?.filter((item) => item?.serviceName == subProblemTitle && item?.status == 'OPEN'
      );
      console.log(filter,'po');

      setPId(prev => filter[0]?.pid);
    }
  },[subProblemTitle,recentProblems]);

  const navigate = useNavigate();
  const navigateTo = (url) => {
    navigate(url);
  };
  const [selectedProblem, setSelectedProblem] = useState("");
  const dispatch = useDispatch();


  const handleProblemChange = (event) => {
    if(event.target.value !== ''){
      setSelectedProblem((prev) => event.target.value);
    }
  };

  const handleSubProblemChange = (event) => {
     if(selectedProblem !== ''){
      const filter = data[selectedProblem].find(item => item.serviceName == event.target.value);
      dispatch(setProblem({problemTitle: selectedProblem, subProblemTitle: event.target.value, problemId: filter.id, serviceName: event.target.value,}))
     }
  };

  useEffect(() => {console.log(data, 'data');})

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className=" w-full">
          <div className="flex flex-col">
            <label
              className="flex justify-start mb-1 text-sm font-medium text-gray-900"
            >
              Problem Title:
            </label>
            <select
              id="problem-title"
              onChange={handleProblemChange}
              defaultValue={''}
              value={problemTitle}
              
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
            >
              <option value="" disabled>
                Select Problem
              </option>
              {Object.keys(data)?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              className="flex justify-start mb-1 text-sm font-medium text-gray-900"
            >
              Sub-Problem:
            </label>
            <select
              disabled={selectedProblem == ""}
              id="sub-problem"
              onChange={handleSubProblemChange}
              defaultValue={""}
              value={subProblemTitle}
              
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
            >
              <option value={""} disabled>
                Select Service
              </option>

              {data[selectedProblem]?.map((item, index) => (
                <option key={index} value={item.serviceName}>
                  {item.serviceName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              className="flex justify-start mb-1 text-sm font-medium text-gray-900"
            >
              Recommendation:
            </label>
            <select
              id="sub-problem"
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
            >
              <option disabled>Select Recommendation</option>
              {["Start Service", "Recommendation 2", "Recommendation 3"].map(
                (item, index) => (
                  <option key={index}>{item}</option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
        <button
          id="createRuleButton"
          className="flex gap-2 focus:outline-none text-black bg-slate-100  hover:bg-slate-200 focus:ring-2  font-medium rounded-sm text-sm px-5 py-2 mb-2"
          onClick={() => {
            if(subProblemTitle) navigateTo(`/assisted-analysis/${pId}`);
          }}
        >
          <i className="fa-solid fa-chart-line my-auto"></i>
          Assisted Analysis
        </button>
        <button
          id="createRuleButton"
          className="flex gap-2 focus:outline-none text-black bg-slate-100  hover:bg-slate-200 focus:ring-2  font-medium rounded-sm text-sm px-5 py-2 mb-2"
          onClick={() => {
            navigateTo("/build-solution");
          }}
        >
          <i className="fa-solid fa-chart-line my-auto"></i>
          Build Solution
        </button>
        </div>

        {/* <div className="w-[40%] flex flex-col justify-center gap-5">
          <div className="mx-auto w-full">
            <div
              className=" hover:bg-main w-full p-5 rounded-md text-main border border-main hover:text-white shadow-sm shadow-slate-400"
              onClick={() => {
                navigateTo("/assisted-analysis");
              }}
            >
              <i className="fa-solid fa-chart-line text-4xl"></i>
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
              <i className="fa-solid fa-puzzle-piece text-4xl"></i>
              <p className="active-problem-option-title">
                <strong>Build Solution</strong>
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RemidiationForm;
