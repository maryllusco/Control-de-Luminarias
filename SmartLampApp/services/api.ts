import axios from "axios";
import { ESP32_IP, TOKEN } from "../constants/config";

export async function configurarESP32(
  ssid: string,
  password: string
) {
  return axios.post(`${ESP32_IP}/config`, {
    ssid,
    password,
    token: TOKEN,
  });
}