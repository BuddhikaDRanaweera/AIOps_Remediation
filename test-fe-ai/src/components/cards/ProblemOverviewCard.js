import AppsOutageIcon from "@mui/icons-material/AppsOutage";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import StorageIcon from "@mui/icons-material/Storage";
import {
  Accordion,
  AccordionSummary,
  Avatar,
  CardHeader,
  Stack,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
const ProblemOverviewCard = ({ data }) => {
  const getDate = (startTime) => {
    const date = new Date(startTime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <Card sx={{ marginLeft: "5rem", marginBottom: "1rem" }}>
      <CardHeader
        sx={{ bgcolor: "#0f0f80" }}
        avatar={
          <Avatar sx={{ bgcolor: " green" }}>
            <SettingsSuggestIcon />
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
            {data?.impactedEntities[0].name} : {data?.title}
          </Typography>
        }
      ></CardHeader>
      <CardContent>
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                Problem {data?.displayId} references.
                {data?.evidenceDetails?.details?.length} individual events
                occured.
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {data?.evidenceDetails?.details.slice(0, 3).map((data, id) => {
                return (
                  <>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        textAlign: "left",
                        color: "black",
                      }}
                    >
                      {getDate(data.startTime)} : Time of event {id + 1}{" "}
                      reported
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        textAlign: "left",
                        color: "black",
                      }}
                    >
                      {getDate(data.endTime)} : Time of event {id + 1} closed
                    </Typography>
                  </>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </div>
        <br />
        <Typography
          sx={{
            fontSize: "1rem", // Increase the font size
            textAlign: "left", // Align the text to the left
            color: "black",
          }}
          gutterBottom
        >
          Root Cause Entity : {data?.rootCauseEntity?.name || "---"}
          <br />
          {data?.evidenceDetails?.details[0]?.data?.properties[0].value}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" my={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{ border: "2px solid grey" }}
          >
            <AppsOutageIcon />
          </Box>
          <div>
            <Typography
              sx={{
                fontSize: "0.9rem", // Adjust the font size
                textAlign: "left", // Align the text to the left
                color: "black",
              }}
            >
              Affected applications
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem", // Adjust the font size
                textAlign: "left", // Align the text to the left
                color: "black",
              }}
            >
              {data?.impactLevel === "APPLICATIONS"
                ? data?.affectedEntities.length
                : 0}
            </Typography>
          </div>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{ border: "2px solid grey" }}
          >
            <MiscellaneousServicesIcon />
          </Box>
          <div>
            <Typography
              sx={{
                fontSize: "0.9rem", // Adjust the font size
                textAlign: "left", // Align the text to the left
                color: "black",
              }}
            >
              Affected services
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem", // Adjust the font size
                textAlign: "left", // Align the text to the left
                color: "black",
              }}
            >
              {data?.impactLevel === "SERVICES"
                ? data?.affectedEntities.length
                : 0}
            </Typography>
          </div>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{ border: "2px solid grey" }}
          >
            <StorageIcon />
          </Box>
          <div>
            <Typography
              sx={{
                fontSize: "0.9rem", // Adjust the font size
                textAlign: "left", // Align the text to the left
                color: "black",
              }}
            >
              Affected infrastructure
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem", // Adjust the font size
                textAlign: "left", // Align the text to the left
                color: "black",
              }}
            >
              {data?.impactLevel === "INFRASTRUCTURE"
                ? data?.affectedEntities.length
                : 0}
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemOverviewCard;
