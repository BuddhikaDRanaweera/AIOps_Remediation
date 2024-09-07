import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch_GET from "../../services/http/Get";
import DateRange from "../../components/date-range/DateRange";
import { convertToIST } from "../../util/helper-func/DateConverter";

const ExecutionHistory = () => {

  const { isLoading, error, data: apiData, getData } = useFetch_GET();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [dateRange, setDateRange] = useState();
  const navigate = useNavigate();
  const {id} = useParams();



  useEffect(() => {
    getData("/get_audit_data");
  }, []);

  useEffect(()=>{
    if(id == 'closed'){
      setSelectedStatus(prev => 'IN_PROGRESS')
    }
  },[id])

  useEffect(() => {
    setData(apiData);
    setFilteredData(apiData);
  }, [apiData]);

  const handleServiceFilterChange = (event) => {
    const value = event.target.value;
    setSelectedService((prev) => value);
    // setFilteredData(
    //   value ? data.filter((item) => item.serviceName === value) : data
    // );
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setSelectedStatus((prev) => value);
    // setFilteredData(
    //   value ? data.filter((item) => item.status === value) : data
    // );
  };

  useEffect(() => {
    console.log(selectedService);
    console.log(selectedStatus);
    
    const filteredData = data?.filter((item) => {
      return (
        (selectedStatus === "" || item.status === selectedStatus) &&
        (selectedService === "" || item.serviceNamem === selectedService) 
      );
    });
    console.log(dateRange, 'date');
     if(dateRange){
      console.log(new Date(dateRange), 'range');
      console.log(new Date(), 'now');
      const now = new Date();
      const fitterDataWithDateRange = filteredData?.filter(item => {
        console.log(convertToIST(item?.problemDetectedAt), 'time');
        const detectedTime = convertToIST(item?.problemDetectedAt);

        return new Date(dateRange) <= detectedTime;

      });
      setFilteredData((prev) => fitterDataWithDateRange);

     }else{
     setFilteredData((prev) => filteredData);
     }

    
  }, [selectedService, selectedStatus, dateRange, id]);

  const getFormattedTime = (range) => {
    const now = new Date();
    let pastDate;
  
    switch (range) {
      case "last 30 min":
        pastDate = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes
        break;
      case "last 1 hour":
        pastDate = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour
        break;
      case "last 6 hours":
        pastDate = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours
        break;
      case "last 24 hours":
        pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours
        break;
      default:
        setDateRange((prev) => null);
        return null;
    }
  
    // Return Unix timestamp (in seconds, not milliseconds)
    const unixTimestamp = Math.floor(pastDate.getTime());
    setDateRange((prev) => unixTimestamp);
  
    // return unixTimestamp;
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) {
      return "N/A";
    } else {
      const durationInMinutes = Math.floor((new Date(end) - new Date(start)) / 60000);
      return `${durationInMinutes} min`;
    }
  };

  return (
    <div className="p-5">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Remediation Execution Records</h2>
          <p>View the execution history of remediation actions.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
        <DateRange
                  range={(date) => {
                    getFormattedTime(date)}}
                />
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px] focus:outline-none block p-1"
            id="remediation-filter"
            onChange={handleServiceFilterChange}
          >
            <option value="">Filter by Service Name</option>
            <option value="apache2">Apache2</option>
            <option value="OneAgent">OneAgent</option>
            <option value="MySQL">MySQL</option>
          </select>
          <select
           className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px] focus:outline-none block p-1"
            id="status-filter"
            onChange={handleStatusFilterChange}
          >
            <option value="">Filter by Status</option>
            <option value="CLOSED">Closed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="px-5 py-2 w-full h-[calc(100vh-190px)] overflow-auto">
        <div className="hidden md:block">
         {filteredData.length !== 0 ? (  <table className="w-full bg-white shadow-sm text-sm text-left">
            <thead className="bg-gray-200 text-xs">
              <tr>
                <th className="p-3 text-center">DisplayID</th>
                <th className="p-3 text-center">Problem Title</th>
                {/* <th className="p-3 text-center">Sub Problem Title</th> */}
                <th className="p-3 text-center">Problem Impact</th>
                <th className="p-3 text-center">Problem Severity</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Service Name</th>
                <th className="p-3 text-center">Actual Downtime</th>
                <th className="p-3 text-center">Action Type</th>
                {/* <th className="p-3 text-center">Comment</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => (
                <tr
                  className="hover:bg-gray-50"
                  key={item.ID}
                  onClick={() =>
                    navigate(`/${item.pid}/${item.executedProblemId}/${item.id}`)
                  }
                >
                  <td className="p-2 text-center">{item.displayId}</td>
                  <td className="p-2 text-start truncate max-w-60">{item.problemTitle}</td>
                  {/* <td className="p-2 text-center truncate">{item.subProblemTitle || "N/A"}</td> */}
                  <td className="p-2 text-center">{item.problemImpact}</td>
                  <td className="p-2 text-center">{item.problemSeverity}</td>
                  <td className="p-2 text-center">{item.status}</td>
                  <td className="p-2 text-start truncate max-w-60">{item.serviceName}</td>
                  <td className="p-2 text-center">{calculateDuration(item.problemDetectedAt, item.problemEndAt)}</td>
                  <td className="p-2 text-center">{item.actionType.toUpperCase()}</td>
                  {/* <td className="p-2 text-center truncate">{item.comments}</td> */}
                </tr>
              ))}
            </tbody>
          </table>): (<p className="flex justify-center p-5 font-semibold">No Avilable Problems.</p>)}
        </div>

        <div className="md:hidden space-y-4">
          {filteredData?.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white  shadow-md border hover:bg-gray-50"
              onClick={() => navigate(`/${item.pid}/${item.executedProblemId}`)}
            >
              <p className="text-sm text-gray-600">ID: {item.displayId}</p>
              <p className="text-sm font-semibold text-gray-800 truncate">Title: {item.problemTitle}</p>
              <p className="text-sm text-gray-600 truncate">Sub Title: {item.subProblemTitle || "N/A"}</p>
              <p className="text-sm text-gray-600">Impact: {item.problemImpact}</p>
              <p className="text-sm text-gray-600">Severity: {item.problemSeverity}</p>
              <p className="text-sm text-gray-600 truncate">Service: {item.serviceName}</p>
              <p className="text-sm text-gray-600">Status: {item.status}</p>
              <p className="text-sm text-gray-600">Downtime: {calculateDuration(item.problemDetectedAt, item.problemEndAt)} min</p>
              <p className="text-sm text-gray-600">Action: {item.actionType.toUpperCase()}</p>
              <p className="text-sm text-gray-600 truncate">Comment: {item.comments}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionHistory;
