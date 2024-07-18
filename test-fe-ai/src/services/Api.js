import axios from "axios";

const api = axios.create({
  baseURL: "http://18.143.73.92:5000/",
});

export default api;
