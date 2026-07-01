#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>
#include <Preferences.h>
#include <ArduinoJson.h>

const char* AP_SSID = "SmartLamp_Config";
const char* AP_PASSWORD = "12345678";

WebServer server(80);

const int LED_PIN = 2;
Preferences preferences;

String wifiSSID = "";
String wifiPassword = "";
String token = "";

bool configurado = false;
bool intentandoConexion = false;
const char\* MQTT_SERVER = "10.56.13.15";
const int MQTT_PORT = 1883;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

void conectarWiFi() {

Serial.println("Cambiando a modo STA...");

WiFi.softAPdisconnect(true);
WiFi.mode(WIFI_STA);

WiFi.begin(wifiSSID.c_str(), wifiPassword.c_str());

unsigned long inicio = millis();

while (WiFi.status() != WL_CONNECTED && millis() - inicio < 45000) {
delay(500);
Serial.print(".");
}

if (WiFi.status() == WL_CONNECTED) {

    Serial.println();
    Serial.println("WiFi conectado");
    Serial.print("IP: ");

conectarMQTT();
Serial.println(WiFi.localIP());

} else {

    Serial.println();
    Serial.println("Error: Timeout de conexión");

    WiFi.mode(WIFI_AP);
    WiFi.softAP(AP_SSID, AP_PASSWORD);

    Serial.println("Volviendo al modo AP");

}

}
void callback(char* topic, byte* payload, unsigned int length) {

String mensaje = "";

for (int i = 0; i < length; i++) {
mensaje += (char)payload[i];
}

Serial.print("Mensaje recibido: ");
Serial.println(mensaje);

if (mensaje.indexOf("\"cmd\":\"ON\"") >= 0) {
digitalWrite(LED_PIN, HIGH);
Serial.println("LED ENCENDIDO");
}

if (mensaje.indexOf("\"cmd\":\"OFF\"") >= 0) {
digitalWrite(LED_PIN, LOW);
Serial.println("LED APAGADO");
}

}

void conectarMQTT() {

mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
mqttClient.setCallback(callback);

while (!mqttClient.connected()) {

    Serial.println("Conectando al Broker MQTT...");

    if (mqttClient.connect("ESP32_LAMP")) {

      Serial.println("MQTT conectado");

      mqttClient.subscribe("lamps/device1/cmd");

      mqttClient.publish(
        "lamps/device1/status",
        "{\"status\":\"OK\"}"
      );

    } else {

      Serial.print("Error MQTT: ");
      Serial.println(mqttClient.state());

      delay(2000);

    }

}

}

void setup() {

Serial.begin(115200);

pinMode(LED_PIN, OUTPUT);
digitalWrite(LED_PIN, LOW);

WiFi.mode(WIFI_AP);

bool ok = WiFi.softAP(AP_SSID, AP_PASSWORD);

Serial.println("================================");
Serial.println("Modo AP iniciado");

Serial.print("AP iniciado: ");
Serial.println(ok ? "SI" : "NO");

Serial.print("SSID: ");
Serial.println(AP_SSID);

Serial.print("IP: ");
Serial.println(WiFi.softAPIP());

Serial.print("Canal: ");
Serial.println(WiFi.channel());

Serial.print("Clientes conectados: ");
Serial.println(WiFi.softAPgetStationNum());

Serial.println("================================");

server.on("/", HTTP_GET, []() {
server.send(200, "text/plain", "ESP32 Smart Lamp");
});
server.on("/config", HTTP_POST, []() {

    if (!server.hasArg("plain")) {
        server.send(400, "text/plain", "JSON faltante");
        return;
    }

    DynamicJsonDocument doc(256);

    deserializeJson(doc, server.arg("plain"));

    wifiSSID = doc["ssid"].as<String>();
    wifiPassword = doc["password"].as<String>();
    token = doc["token"].as<String>();

    preferences.begin("config", false);
    preferences.putString("ssid", wifiSSID);
    preferences.putString("pass", wifiPassword);
    preferences.putString("token", token);
    preferences.end();

    configurado = true;

    server.send(200, "application/json", "{\"status\":\"OK\"}");

});

server.begin();

Serial.println("Servidor HTTP iniciado");
}

void loop() {

server.handleClient();

if (configurado && !intentandoConexion) {

    intentandoConexion = true;

    conectarWiFi();

}

mqttClient.loop();

}
