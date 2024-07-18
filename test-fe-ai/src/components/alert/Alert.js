import Alert from "@mui/material/Alert";
import React from "react";
import { useSelector } from "react-redux";
const AlertComponent = () => {
  const alert = useSelector((state) => state.alert);
  return (
    <Alert variant="filled" severity={alert.variant}>
      {alert.alert}
    </Alert>
  );
};

export default AlertComponent;
