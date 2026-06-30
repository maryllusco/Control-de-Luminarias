import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

export function conectarMQTT() {
  console.log("Conectar al broker MQTT");
}

export function desconectarMQTT() {
  if (client) {
    client.end();
    client = null;
  }
}

export function publicarComando(cmd: "ON" | "OFF") {
  console.log("Enviar comando:", cmd);
}

export function suscribirseEstado() {
  console.log("Suscribirse al estado");
}