import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

const BROKER = "ws://10.56.13.15:9001";

export function conectarMQTT(onOK?: () => void) {
  if (client) return;

  client = mqtt.connect(BROKER);

  client.on("connect", () => {
    console.log("MQTT conectado");

    client?.subscribe("lamps/device1/status");
  });

  client.on("message", (_, message) => {
    try {
      const datos = JSON.parse(message.toString());

      if (datos.status === "OK") {
        onOK?.();
      }
    } catch (e) {
      console.log(e);
    }
  });
}

export function publicarComando(cmd: "ON" | "OFF") {
  if (!client) return;

  client.publish(
    "lamps/device1/cmd",

    JSON.stringify({
      cmd,

      token: "abc123",
    }),
  );
}

export function desconectarMQTT() {
  client?.end();

  client = null;
}
