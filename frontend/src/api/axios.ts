import axios from "axios";
import { baseURL } from "./baseUrl";

export const axiosClient = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  timeout: 100000,
});
