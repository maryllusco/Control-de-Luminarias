import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Smart Lamp",
          }}
        />

        <Stack.Screen
          name="qr"
          options={{
            title: "Escanear QR",
          }}
        />

        <Stack.Screen
          name="provision"
          options={{
            title: "Configurar WiFi",
          }}
        />

        <Stack.Screen
          name="waiting"
          options={{
            title: "Conectando",
          }}
        />

        <Stack.Screen
          name="control"
          options={{
            title: "Control",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
