import moment from "moment";

export const formatDateString = (dateString) => {
  // Split the input date and time
  const [datePart, timePart] = dateString.split(" - ");

  // Split the date into day, month, and year
  const [day, month, year] = datePart.split("/");

  // Split the time into hours, minutes, and seconds
  const [hours, minutes, seconds] = timePart.split(" : ");

  // Create a new Date object
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  // Format the date to the desired format
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDate = date.toLocaleString("en-US", options).replace(",", "");

  return formattedDate;
};

export const formatDateToCustomFormat = (dateString) => {
  if (!dateString) return "";
  const dateInUTC = moment(dateString);
  return dateInUTC.format("YYYY:MM:DD - HH:mm:ss");
};
export const formatDateToUTCFormat = (dateString) => {
  if (!dateString) return "";
  const dateInUTC = moment.utc(dateString);
  return dateInUTC.format("YYYY:MM:DD - HH:mm:ss");
};
export const formatDateToUTCFormatCal = (dateString) => {
  if (!dateString) return "";
  return moment(dateString).unix();// Adjust format as needed
};

export const convertToIST = (gmtDateString) => {
  // Create a new Date object from the GMT date string
  const gmtDate = new Date(gmtDateString);

  // Convert to India Standard Time (GMT+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(gmtDate.getTime() - istOffset);

  // Format the date to the desired output
  const formattedDate = istDate; // Will return the format like: "Sat Sep 07 2024 09:10:03 GMT+0530 (India Standard Time)"

  return formattedDate;
}


export const calculateTimeDifference = (startTime, endTime) => {
  // Convert start and end time to Date objects if they are not already
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Calculate the difference in milliseconds
  const differenceMs = endDate - startDate;

  // Convert the difference to seconds (or any other unit)
  const differenceSeconds = differenceMs / 1000;

  return differenceSeconds;
};