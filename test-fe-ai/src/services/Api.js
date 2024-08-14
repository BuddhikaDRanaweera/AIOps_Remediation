import axios from "axios";

const api = axios.create({
  baseURL: "http://47.129.247.227:5000/",
});

export default api;
