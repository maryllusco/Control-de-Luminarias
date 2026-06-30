import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import { configurarESP32 } from "../services/api";

export default function ProvisionScreen() {
  const { ssid, password } = useLocalSearchParams();

  const [wifi, setWifi] = useState(String(ssid));
  const [pass, setPass] = useState(String(password));

  const [redOculta, setRedOculta] = useState(false);

  // Mañana esta lista vendrá del GET /networks
  const [redes] = useState([
    "Buscando redes..."
  ]);

  const enviarConfiguracion = async () => {
    try {
      await configurarESP32(wifi, pass);
      router.replace("/waiting");
    } catch (error) {
      console.log(error);
      alert("No se pudo conectar con el ESP32");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar dispositivo</Text>

      <View style={styles.switchContainer}>
        <Text>Mi red está oculta</Text>

        <Switch
          value={redOculta}
          onValueChange={setRedOculta}
        />
      </View>

      {redOculta ? (
        <>
          <Text style={styles.label}>SSID</Text>

          <TextInput
            value={wifi}
            onChangeText={setWifi}
            placeholder="Ingrese el nombre de la red"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Red WiFi</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={wifi}
              onValueChange={(itemValue) => setWifi(itemValue)}
            >
              {redes.map((red) => (
                <Picker.Item
                  key={red}
                  label={red}
                  value={red}
                />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Contraseña</Text>

      <TextInput
        value={pass}
        onChangeText={setPass}
        secureTextEntry
        placeholder="Contraseña"
        style={styles.input}
      />

      <Button
        title="Configurar dispositivo"
        onPress={enviarConfiguracion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});