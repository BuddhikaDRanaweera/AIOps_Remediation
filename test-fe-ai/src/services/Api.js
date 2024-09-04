import axios from "axios";

const api = axios.create({
  baseURL: "http://13.229.134.248:5000/",
});

export default api;
