import { useState } from "react";
import api from "../Api";
import { useDispatch } from "react-redux";
import { clearAlert, setAlert } from "../../app/features/alert/alert";

const useFetch_DELETE = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const deleteData = async (url) => {
    setIsLoading(true);
    try {
      const response = await api.delete(url);
      setData(response);
      dispatch(
        setAlert({
          alert: response.data,
          variant: "success",
          open: true,
        })
      );
    } catch (error) {
      dispatch(
        setAlert({
          alert: error?.message || "error",
          variant: "info",
          open: true,
        })
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        // dispatch(setAlert({ status: null, open: false }));
      }, 3000);
    }
  };

  return { isLoading, error, data, deleteData };
};

export default useFetch_DELETE;
