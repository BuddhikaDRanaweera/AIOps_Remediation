import React, { useEffect, useState } from "react";
import useFetch_GET from "../../services/http/Get";
/* import ProblemForm from "./ProblemList"; */
import RemidiationForm from "./RemidiationForm";
import { useDispatch } from "react-redux";
import { setNewRemediation } from "../../app/features/modals_view/modal";

const Dashboard = () => {
  const [problemData, setProblemData] = useState([]);
  // const [handleSelectData, setHandleSelectData] = useState();
  const { isLoading, error, data, getData } = useFetch_GET();

  const dispatch = useDispatch();
  
  useEffect(() => {
    if(data){
      console.log(transformData(data), 'new problem list');
      setProblemData(transformData(data));
    }
  }, [data]);

  const transformData = (value) => {
    const result = {};
    value.forEach(item => {
      const { problemTitle, serviceName, id } = item;
      if (!result[problemTitle]) {
        result[problemTitle] = [];
      }
      result[problemTitle].push({id,serviceName});
    });

    return result;
  }

  

  useEffect(() => {
    getData("/get_new_problems");
  }, []);

  return (
 
    <div className="px-10 py-10">
      <div className="flex justify-end">
        <button
          id="createRuleButton"
          className="focus:outline-none text-white bg-main  hover:bg-second focus:ring-4 focus:ring-third font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
          onClick={() => {
            dispatch(setNewRemediation(true))
          }}
        >
          Create New Rule
        </button>
      </div>
      <div className="w-full flex justify-center">
        <RemidiationForm data={problemData} />
      </div>
    </div>
  );
};

export default Dashboard;
