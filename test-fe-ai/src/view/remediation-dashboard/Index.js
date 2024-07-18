import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
/* import ProblemForm from "./ProblemList"; */
import RemidiationForm from "./RemidiationForm";

const Dashboard = () => {
  const [problemData, setProblemData] = useState([]);
  const [handleSelectData, setHandleSelectData] = useState();
  const { isLoading, error, data, getData } = useFetch_GET();
  console.log(problemData, "LKLKLK");
  useEffect(() => {
    setProblemData(data);
  }, [data]);
  const navigate = useNavigate();

  const handleSubmit = (value) => {
    console.log(value);
    setHandleSelectData(value);
  };

  useEffect(() => {
    getData("/get_new_problems");
  }, []);

  return (
    // <div>
    //   <div>
    //     <button
    //       id="createRuleButton"
    //       className="createrulebutton"
    //       onClick={() => {
    //         navigate("/new-rule");
    //       }}
    //     >
    //       Create New Rule
    //     </button>

    //     <div className="container">
    //       {/* <div className="left-panel">
    //         <div className="table-header">Problem List</div>
    //         <ProblemForm data={problemData} onSubmit={handleSubmit} />
    //       </div> */}
    //       <RemidiationForm data={data} />
    //     </div>
    //   </div>
    // </div>

    <div className="px-5">
      <div className="flex justify-end p-2">
        <button
          id="createRuleButton"
          className="focus:outline-none text-white bg-main  hover:bg-second focus:ring-4 focus:ring-third font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
          onClick={() => {
            navigate("/new-rule");
          }}
        >
          Create New Rule
        </button>
      </div>
      <div className="w-full flex justify-center">
        <RemidiationForm data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
