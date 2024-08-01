import axios from "axios";

const api = axios.create({
  baseURL: "http://13.213.52.224:5000/",
});

export default api;
