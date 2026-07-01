import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { conectarMQTT, desconectarMQTT } from "../services/mqtt";

export default function WaitingScreen() {
  const [timeout, setTimeoutReached] = useState(false);

  useEffect(() => {
    conectarMQTT(() => {
      router.replace("/control");
    });

    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 45000);

    return () => {
      clearTimeout(timer);

      desconectarMQTT();
    };
  }, []);
  if (timeout) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          No fue posible configurar el dispositivo.
        </Text>

        <Text style={styles.text}>
          Verificá la contraseña del WiFi e intentá nuevamente.
        </Text>

        <Button
          title="Volver a intentar"
          onPress={() => router.replace("/provision")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />

      <Text style={styles.title}>Configurando dispositivo...</Text>

      <Text style={styles.text}>Esperando respuesta del ESP32.</Text>

      <Text style={styles.text}>Esto puede tardar hasta 45 segundos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },

  error: {
    fontSize: 22,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
