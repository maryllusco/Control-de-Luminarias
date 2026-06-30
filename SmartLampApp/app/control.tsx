import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function ControlScreen() {
  const [estado, setEstado] = useState("APAGADA");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Smart Lamp</Text>

      <Text style={styles.label}>Estado actual</Text>

      <Text style={styles.estado}>{estado}</Text>

      <Pressable
        style={styles.onButton}
        onPress={() => {
          setEstado("ENCENDIDA");
          // publicarComando("ON")
        }}
      >
        <Text style={styles.buttonText}>ENCENDER</Text>
      </Pressable>

      <Pressable
        style={styles.offButton}
        onPress={() => {
          setEstado("APAGADA");
          // publicarComando("OFF")
        }}
      >
        <Text style={styles.buttonText}>APAGAR</Text>
      </Pressable>

      <Text style={styles.info}>
        Broker: Desconectado
      </Text>

      <Text style={styles.info}>
        Dispositivo: Sin conexión
      </Text>
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
  },

  info: {
    marginTop: 10,
    color: "gray",
  },
});