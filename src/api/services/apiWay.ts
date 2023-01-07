import axios from "axios";

const APIKEY = process.env.APIKEY_WAY2;

export const apiWay = axios.create({
  baseURL: process.env.URL_WAY2,
});
