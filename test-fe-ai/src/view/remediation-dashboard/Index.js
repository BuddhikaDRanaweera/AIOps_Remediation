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
  const { isLoading:allProblemLoading, error:allProblemError, data:allProblemData, getData:allProblemGetData } = useFetch_GET();

  const dispatch = useDispatch();
  
  useEffect(() => {
    if(data){
      console.log(transformData(data), 'new problem list');
      setProblemData(transformData(data));
    }
  }, [data]);

  const [isHighlightChecked, setIsHighlightChecked] = useState(false);
  const handleHighlightChange = () => {
    setIsHighlightChecked((prev) => !prev);
  };

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
    allProblemGetData("/problems");
  }, []);

  useEffect(()=>{
    if(allProblemData) console.log(allProblemData, 'hvchjdscnm');
  },[allProblemData])

  return (
 
    <div className="p-5 flex gap-2">
     
     <div className="flex flex-col gap-2 bg-white p-5 shadow-sm shadow-slate-400 w-[700px]">
      <div className="flex justify-between">
        <h3 className="text-sm font-semibold">Active Problem</h3>
        <button
          id="createRuleButton"
          className="focus:outline-none text-white bg-main  hover:bg-second focus:ring-4 focus:ring-third font-medium rounded-sm text-sm px-5 py-2 mb-2"
          onClick={() => {
            dispatch(setNewRemediation(true))
          }}
        >
          Create Rule
        </button>
      </div>
      <div>
      <RemidiationForm data={problemData} />
      </div>
     </div>

     {/*  */}

     <div className="bg-white p-5 h-[400px] w-[calc(100vw-700px)] shadow-sm shadow-slate-400">
            <div className="flex justify-between ">
              <h3 className="text-sm font-semibold">All Problems</h3>
              <div className="flex items-center gap-2 px-2 border h-[29px] bg-slate-50 border-gray-200">
                <input
                  id="bordered-checkbox-1"
                  type="checkbox"
                  value=""
                  checked={isHighlightChecked}
                  onChange={handleHighlightChange}
                  name="bordered-checkbox"
                  className=" text-blue-600 bg-gray-100 border-gray-300"
                />
                <label className="w-full text-gray-900">
                  <p className="text-xs p-0 m-0">Highlight</p>
                </label>
              </div>
            </div>
            <div className="py-2">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-200 text-sm">
                    <th className="p-2">id</th>
                    <th>title</th>
                    <th>service</th>
                    <th>status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allProblemData?.map((incident, index) => (
                    <tr
                      key={index}

                      className={`${incident?.status == 'RESOLVED' && isHighlightChecked &&'bg-green-50'} ${incident?.status == 'NOT_RESOLVED' && isHighlightChecked &&'bg-red-50'} hover:bg-slate-50 text-xs border-b border-gray-300`}
                    >
                      <td className="p-2">{incident?.id}</td>
                      <td>{incident?.problemTitle}</td>
                      <td>{incident?.serviceName}</td>
                      <td>{incident?.status}</td>

                      <td>
                        {/* <BsArrowUpRightSquareFill className="text-lg" /> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


    </div>
  );
};

export default Dashboard;
