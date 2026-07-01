import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  conectarMQTT,
  desconectarMQTT,
  publicarComando,
} from "../services/mqtt";

export default function ControlScreen() {
  const [estado, setEstado] = useState("APAGADA");
  const [broker, setBroker] = useState("Conectando...");

  useEffect(() => {
    conectarMQTT();

    setBroker("Conectado");

    return () => {
      desconectarMQTT();
    };
  }, []);

  const encender = () => {
    publicarComando("ON");
    setEstado("ENCENDIDA");
  };

  const apagar = () => {
    publicarComando("OFF");
    setEstado("APAGADA");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Smart Lamp</Text>

      <Text style={styles.label}>Estado actual</Text>

      <Text style={styles.estado}>{estado}</Text>

      <Pressable style={styles.onButton} onPress={encender}>
        <Text style={styles.buttonText}>ENCENDER</Text>
      </Pressable>

      <Pressable style={styles.offButton} onPress={apagar}>
        <Text style={styles.buttonText}>APAGAR</Text>
      </Pressable>

      <Text style={styles.info}>Broker MQTT: {broker}</Text>

      <Text style={styles.info}>Comandos: lamps/device1/cmd</Text>

      <Text style={styles.info}>Estado: lamps/device1/status</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
  },

  estado: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },

  onButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    width: 220,
    marginBottom: 15,
  },

  offButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    width: 220,
    marginBottom: 30,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  info: {
    marginTop: 10,
    color: "gray",
    fontSize: 14,
  },
});
