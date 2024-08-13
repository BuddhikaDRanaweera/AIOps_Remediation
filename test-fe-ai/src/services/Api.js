import axios from "axios";

const api = axios.create({
  baseURL: "http://13.213.37.74:5000/",
});

export default api;
