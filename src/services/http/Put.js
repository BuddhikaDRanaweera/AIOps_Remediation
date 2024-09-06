import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "../../app/features/AlertSlice";
import { setGlobalLoading } from "../../app/features/loading/LoadingSlice";
import api from "../Api";

const useFetch_PUT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const putData = async (url, requestData) => {
    setIsLoading(true);
    try {
      const response = await api.put(url, requestData);
      setData(response?.data);
      dispatch(setAlert({ alert: response?.status, open: true }));
    } catch (error) {
      dispatch(setAlert({ status: error?.response?.status, open: true }));
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        dispatch(setAlert({ status: null, open: false }));
      }, 3000);
      dispatch(setGlobalLoading({ loading: false }));
    }
  };

  return { isLoading, error, data, putData };
};

export default useFetch_PUT;
