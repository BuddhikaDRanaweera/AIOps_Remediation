import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearAlert, setAlert } from "../../app/features/alert/alert";
import {
  clearGlobalLoading,
  setGlobalLoading,
} from "../../app/features/loading/LoadingSlice";
import api from "../Api";

const useFetch_POST = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const postData = async (url, requestData) => {
    dispatch(setGlobalLoading({ loading: true }));
    setIsLoading(true);
    try {
      const response = await api.post(url, requestData);
      setData(response);
      console.log(response);
      
      // if (response?.status == 200 || response?.status == 201)
      //   dispatch(
      //     setAlert({
      //       alert: response?.data,
      //       variant: "success",
      //       open: true,
      //     })
      //   );
    } catch (error) {
      dispatch(
        setAlert({
          alert: error?.message || "error",
          variant: "info",
          open: true,
        })
      );
      setError(error);
      console.log(error);
    } finally {
      dispatch(clearGlobalLoading());
      setIsLoading(false);
      setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
    }
  };

  return { isLoading, error, data, postData };
};

export default useFetch_POST;
