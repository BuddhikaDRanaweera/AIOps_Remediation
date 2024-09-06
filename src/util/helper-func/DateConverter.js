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

  // Parse the date with moment, assume it's in UTC
  const dateInUTC = moment.utc(dateString);

  // Convert to IST and format
  return dateInUTC.format("YYYY:MM:DD - HH:mm:ss");
};
