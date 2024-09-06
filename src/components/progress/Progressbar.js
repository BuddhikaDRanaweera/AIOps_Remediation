import { LinearProgress, Stack } from "@mui/material";
import React from "react";

const Progressbar = () => {
  return (
    <div>
      <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
        <LinearProgress color="inherit" />
      </Stack>
    </div>
  );
};

export default Progressbar;
