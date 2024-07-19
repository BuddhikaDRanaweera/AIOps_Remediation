import axios from "axios";

const api = axios.create({
  baseURL: "http://3.1.222.146:5000/",
});

export default api;
