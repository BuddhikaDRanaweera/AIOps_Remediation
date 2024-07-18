import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearAlert, setAlert } from "../../app/features/alert/alert";
import {
  clearGlobalLoading,
  setGlobalLoading,
} from "../../app/features/loading/LoadingSlice";
import api from "../Api";

const useFetch_GET = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const getData = async (url) => {
    setIsLoading(true);
    dispatch(setGlobalLoading({ loading: true }));
    try {
      const response = await api.get(url);
      setData(response?.data);
      console.log(response.data, "response");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        console.log("Message:", error.response.data);
        dispatch(
          setAlert({
            alert: error?.response.data.message || "Not found",
            variant: "info",
            open: true,
          })
        );
        // Handle the "No new Problem Discovered" message
      } else {
        console.error("An error occurred:", error.message);
        dispatch(
          setAlert({
            alert: error?.message,
            variant: "warning",
            open: true,
          })
        );
        // Handle other types of errors
      }
      setError(error);
    } finally {
      dispatch(clearGlobalLoading());
      setIsLoading(false);
      setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
    }
  };

  return { isLoading, error, data, getData };
};

export default useFetch_GET;
