import axios from "axios";

export const api = axios.create({
  baseURL: "localhost:8000/api",
});

export const brasilApi = axios.create({
  baseURL: "https://brasilapi.com.br/api/",
});
