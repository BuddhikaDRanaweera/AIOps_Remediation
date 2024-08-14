import axios from "axios";

const api = axios.create({
  baseURL: "http://18.141.159.33:5000/",
});

export default api;
