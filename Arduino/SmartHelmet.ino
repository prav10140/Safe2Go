
//That was the feature 

/*
  ESP32 Accident + Drowsiness Detection + Backend Alert
  - MPU6050 for accident detection
  - IR digital sensor for drowsiness (stable consecutive detection)
  - GPS (TinyGPS++) prints location when alarm triggers
  - 4-pin push button: short press -> cancel alarm, long press -> SOS
  - Buzzer (active). Alerts sent to backend server via Wi-Fi
*/

#include <Wire.h>
#include <MPU6050.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>

MPU6050 mpu;
TinyGPSPlus gps;
HardwareSerial SerialGPS(1);  

// --- Pin definitions ---
const uint8_t BUZZER_PIN  = 25;
const uint8_t BUTTON_PIN  = 4;
const uint8_t IR_PIN      = 34;

// --- Thresholds ---
const float ACCEL_THRESHOLD_G = 2.0;
const float ACCEL_DELTA_G     = 1.0;
const unsigned long SAMPLE_MS = 100;
const int DROWSY_CONSECUTIVE_REQUIRED = 12;
const unsigned long LONG_PRESS_MS = 2000;

// --- Wi-Fi & Backend ---
const char* ssid = "Narzo_";
const char* password = "*********";
const char* backendUrl = "https://smart-helmet-server-ebon.vercel.app/api/sos";

// --- Runtime variables ---
bool buzzerOn = false;
bool buzzerBlinkMode = false;
unsigned long lastSampleTime = 0;
unsigned long lastBlinkToggle = 0;
bool alertSent = false;  

// Button state
bool buttonPressed = false;
unsigned long buttonPressStart = 0;

// IR drowsiness counter
int drowsyCounter = 0;

// MPU previous accel for delta detection
float lastAccelG = 0.0;

// --- Utilities ---
void printGPSIfValid() {
  if (gps.location.isValid()) {
    Serial.print("GPS -> Lat: ");
    Serial.print(gps.location.lat(), 6);
    Serial.print("  Lng: ");
    Serial.println(gps.location.lng(), 6);
  } else {
    Serial.println("GPS -> location invalid");
  }
}

void buzzerActivate() { digitalWrite(BUZZER_PIN, HIGH); }
void buzzerDeactivate() { digitalWrite(BUZZER_PIN, LOW); }

void sendAlertToBackend(const String& type) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(backendUrl);
  http.addHeader("Content-Type", "application/json");

  String body = "{\"timestamp\":\"" + String(millis()) + "\", \"type\":\"" + type + "\"";

  if (gps.location.isValid()) {
    body += ",\"lat\":" + String(gps.location.lat(), 6) + ",\"lng\":" + String(gps.location.lng(), 6);
  }
  body += "}";

  int httpResponseCode = http.POST(body);
  if (httpResponseCode > 0) {
    Serial.printf("✅ Alert sent! Response code: %d\n", httpResponseCode);
    Serial.println(http.getString());
  } else {
    Serial.printf("❌ Alert failed! Error code: %d\n", httpResponseCode);
  }
  http.end();
}

// --- Button Working ---
void handleButton() {
  bool pressedNow = (digitalRead(BUTTON_PIN) == LOW);

  if (pressedNow && !buttonPressed) {
    buttonPressed = true;
    buttonPressStart = millis();
  } else if (!pressedNow && buttonPressed) {
    unsigned long duration = millis() - buttonPressStart;
    if (duration >= LONG_PRESS_MS) {
      // Long press -> SOS
      buzzerOn = true;
      buzzerBlinkMode = false;
      Serial.println("BUTTON: Long press -> SOS activated");
      printGPSIfValid();
      if (!alertSent) {
        sendAlertToBackend("SOS");
        alertSent = true;
      }
    } else {
      // Short press -> cancel alarm
      buzzerOn = false;
      buzzerBlinkMode = false;
      Serial.println("BUTTON: Short press -> alarm canceled");
      alertSent = false;  // reset alert flag
    }
    buttonPressed = false;
  }
}

void handleButtonQuick() {
  bool pressedNow = (digitalRead(BUTTON_PIN) == LOW);
  if (pressedNow && !buttonPressed) {
    buttonPressed = true;
    buttonPressStart = millis();
  } else if (!pressedNow && buttonPressed) {
    unsigned long duration = millis() - buttonPressStart;
    if (duration >= LONG_PRESS_MS) {
      buzzerOn = true;
      buzzerBlinkMode = false;
      Serial.println("BUTTON(quick): Long press -> SOS activated");
      printGPSIfValid();
      if (!alertSent) {
        sendAlertToBackend("SOS");
        alertSent = true;
      }
    } else {
      buzzerOn = false;
      buzzerBlinkMode = false;
      Serial.println("BUTTON(quick): Short press -> alarm canceled");
      alertSent = false;  // reset alert flag
    }
    buttonPressed = false;
  }
}



void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println(F("Starting Accident+Drowsiness Monitor"));

  // Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");

  // GPS UART
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);

  // MPU6050
  Wire.begin();
  mpu.initialize();
  if (mpu.testConnection()) Serial.println(F("MPU6050: connected"));
  else Serial.println(F("MPU6050: FAILED"));

  // Pins
  pinMode(BUZZER_PIN, OUTPUT);
  buzzerDeactivate();
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(IR_PIN, INPUT);

  // Initial accel reference
  delay(100);
  int16_t ax0, ay0, az0;
  mpu.getAcceleration(&ax0, &ay0, &az0);
  lastAccelG = sqrt((float)ax0*ax0 + (float)ay0*ay0 + (float)az0*az0) / 16384.0;
  Serial.print("Initial accel (g): "); Serial.println(lastAccelG, 3);
}


void loop() {
  // Read GPS
  while (SerialGPS.available() > 0) gps.encode(SerialGPS.read());

  unsigned long now = millis();
  if (now - lastSampleTime < SAMPLE_MS) {
    handleButtonQuick();
    return;
  }
  lastSampleTime = now;

  // --- MPU6050 acceleration ---
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);
  float accelG = sqrt((float)ax*ax + (float)ay*ay + (float)az*az) / 16384.0;
  float deltaG = fabs(accelG - lastAccelG);
  lastAccelG = accelG;

  Serial.print("Accel(g): "); Serial.print(accelG, 3);
  Serial.print("  Δg: "); Serial.print(deltaG, 3);

  // Accident detection
  if (accelG >= ACCEL_THRESHOLD_G || deltaG >= ACCEL_DELTA_G) {
    buzzerOn = true;
    buzzerBlinkMode = false;
    Serial.print("  <-- ACCIDENT DETECTED");
    printGPSIfValid();
    if (!alertSent) {
      sendAlertToBackend("accident");
      alertSent = true;
    }
  }
  Serial.println();

  // --- IR sensor drowsiness ---
  int irVal = digitalRead(IR_PIN);
  const int IR_BLOCK_VALUE = LOW;
  if (irVal == IR_BLOCK_VALUE) {
    drowsyCounter++;
    Serial.print(" IR:block("); Serial.print(drowsyCounter); Serial.print(")");
    if (drowsyCounter >= DROWSY_CONSECUTIVE_REQUIRED) {
      buzzerOn = true;
      buzzerBlinkMode = true;
      Serial.println("  <-- DROWSINESS CONFIRMED");
      printGPSIfValid();
      if (!alertSent) {
        sendAlertToBackend("drowsiness");
        alertSent = true;
      }
      drowsyCounter = 0;
    } else {
      Serial.println();
    }
  } else {
    if (drowsyCounter > 0) Serial.println(" IR:clear -> reset counter");
    drowsyCounter = 0;
  }

  // --- Button handling ---
  handleButton();

  // --- Apply buzzer ---
  if (buzzerOn) {
    if (buzzerBlinkMode) {
      if (now - lastBlinkToggle > 500) {
        lastBlinkToggle = now;
        if (digitalRead(BUZZER_PIN) == HIGH) buzzerDeactivate();
        else buzzerActivate();
      }
    } else buzzerActivate();
  } else buzzerDeactivate();
}
