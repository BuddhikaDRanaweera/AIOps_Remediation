import axios from "axios";

const api = axios.create({
  baseURL: "http://54.255.91.235:5000/",
});

export default api;
