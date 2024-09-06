import axios from "axios";

const api = axios.create({
  baseURL: "http://18.140.69.89:5000/",
});

export default api;
