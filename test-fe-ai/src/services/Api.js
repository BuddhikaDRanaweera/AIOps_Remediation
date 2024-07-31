import axios from "axios";

const api = axios.create({
  baseURL: "http://13.213.8.38:5000/",
});

export default api;
