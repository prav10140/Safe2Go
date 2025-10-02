# An IoT-Based Smart Helmet for Accident Detection and Rider Safety

This project is a low-cost, wearable smart helmet designed to improve rider safety by detecting accidents, monitoring drowsiness, and sending real-time alerts with GPS location.  
The system is compact and can be easily integrated into any helmet without affecting comfort or usability.

---

## Features
- Accident Detection – Detects sudden impacts using the MPU6050 accelerometer and gyroscope.  
- Drowsiness Detection – Monitors rider’s eye state using an IR sensor to prevent accidents caused by fatigue.  
- Real-Time Alerts – Sends WhatsApp and email notifications with live GPS location when an accident or drowsiness is detected.  
- Voice Navigation – Provides hands-free navigation for safe riding.  
- Dashboard Monitoring – A React-based web dashboard for tracking data and analytics.  
- Compact Design – Small device that can fit inside any helmet without modifications.  

---
## Project Folder Structure

Smart-Helmet-Accident-Drowsiness-Detection/
│
├── Arduino/
│   └── SmartHelmet.ino          # Main Arduino code for ESP32
│
├── Backend/
│   ├── server.js                # Node.js backend server
│   ├── routes/                  # API routes for alerts
│   └── package.json             # Dependencies
│
├── Dashboard/
│   ├── src/
│   │   ├── App.js               # React main app
│   │   ├── components/          # UI components
│   │   └── data/                # Data handlers
│   └── public/                  # Static assets
│
├── Data/
│   └── example_data.csv         # Sample event logs
│
├── Images/
│   ├── Helmet_3D.png            # Helmet model/render
│   └── Circuit_Diagram.jpg      # Circuit connections
│
└── README.md                    # Documentation

---

## Hardware Components
- ESP32 Development Board  
- MPU6050 (Accelerometer + Gyroscope)  
- IR Sensor (Eye state detection)  
- GPS Module (TinyGPS++)  
- Push Button (short press = cancel alarm, long press = SOS)  
- Active Buzzer  
- Battery Pack  

---

## Software & Tools
- Arduino IDE – for ESP32 code  
- Node.js + Express – backend server  
- React.js – dashboard frontend  
- Twilio WhatsApp API – for accident alerts  
---

## System Working

### 1. Accident Detection
- The MPU6050 sensor measures acceleration and angular velocity of the helmet.  
- When sudden abnormal changes in acceleration or orientation are detected (e.g., a fall or collision), the system interprets it as a possible accident.  
- The buzzer is activated, and the rider has a short time to cancel the alert by pressing the button.  
- If the alert is not canceled, the system sends accident details and GPS location to the backend.

### 2. Drowsiness Detection (IR Sensor for Eye State)
- An IR sensor (infrared sensor) is placed inside the helmet, facing the rider’s eyes.  
- The IR sensor works by emitting infrared light and detecting the reflected signal:  
  - When the eye is **open**, the reflection is different compared to when it is **closed**.  
  - The sensor output changes based on whether the eyelid blocks the reflection.  
- The system continuously monitors the eye state:  
  - If the eyes remain closed for longer than a safe threshold (e.g., 2–3 seconds), the helmet interprets this as drowsiness.  
  - The buzzer immediately warns the rider.  
  - If the rider does not respond, the system sends a drowsiness alert with location details to the backend.  

### 3. Alert System
- Alerts are processed by the backend server built with Node.js.  
- The backend integrates with Twilio API (for WhatsApp) and Brevo SMTP API (for email).  
- In case of accident or drowsiness, notifications containing GPS coordinates are sent to emergency contacts.  

### 4. Dashboard Monitoring
- A React-based web dashboard shows:  
  - Helmet status (normal, accident, drowsy)  
  - Real-time GPS location of the rider  
  - Historical logs and event analysis  

---

## Future Enhancements
- AI-based image processing for advanced drowsiness detection  
- Battery optimization for long rides  
- Integration with smart traffic systems for faster emergency response  

---

## Contribution
Feel free to fork this repository, open issues, or suggest improvements. Contributions are always welcome.  

---

## Contact
Created by Praveen  
For queries or collaboration: *prav9406@gmail.com*  

---

## Tags
IoT, Smart Helmet, ESP32, ReactJS, Node.js, Wearable Tech, Rider Safety, Accident Detection, Drowsiness Detection
