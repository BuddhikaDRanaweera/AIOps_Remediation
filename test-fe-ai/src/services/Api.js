import axios from "axios";

const api = axios.create({
  baseURL: "http://54.179.240.210:5000/",
});

export default api;
