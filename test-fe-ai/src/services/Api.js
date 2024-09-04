import axios from "axios";

const api = axios.create({
  baseURL: "http://13.250.95.32:5000/",
});

export default api;
