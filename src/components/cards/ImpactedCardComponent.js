import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Avatar, CardHeader } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";

const ImpactedCardComponent = ({ data }) => {
  return (
    <Card sx={{ marginLeft: "3rem" }}>
      <CardHeader
        sx={{ bgcolor: "#0f0f80" }}
        avatar={
          <Avatar sx={{ bgcolor: " red" }}>
            <ReportProblemIcon />
          </Avatar>
        }
        title={
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.5rem", // Increase the font size
              textAlign: "left", // Align the text to the left
              color: "white",
            }}
          >
            {data?.impactedEntities[0].name}
          </Typography>
        }
      ></CardHeader>
      <CardContent>
        <Typography
          sx={{
            fontSize: "1rem", // Increase the font size
            textAlign: "left", // Align the text to the left
            color: "black",
          }}
          gutterBottom
        >
          {data?.title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem", // Increase the font size
            textAlign: "left", // Align the text to the left
            color: "black",
          }}
          gutterBottom
        >
          {data?.evidenceDetails?.details[0]?.data?.properties[0].value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImpactedCardComponent;
