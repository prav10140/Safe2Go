# 🚨 An IoT-Based Smart Helmet for Accident Detection and Rider Safety 🏍️🛡️

This project is a **low-cost, wearable smart helmet** designed to improve **rider safety** by detecting accidents, monitoring drowsiness, and sending real-time alerts with GPS location.  
It can be easily integrated into **any helmet** without affecting comfort or usability.

---

## 🔑 Features
- ⚡ **Accident Detection** – Detects sudden impacts using the **MPU6050 accelerometer & gyroscope**.  
- 👀 **Drowsiness Detection** – Monitors rider’s eye state using **IR sensor** to prevent accidents.  
- 🌍 **Real-Time Alerts** – Sends **WhatsApp & email notifications** with live GPS location when an accident is detected.  
- 🎤 **Voice Navigation** – Provides **hands-free navigation** for safe riding.  
- 🖥️ **Dashboard Monitoring** – A **React-based web dashboard** for tracking data and analytics.  
- 🔋 **Compact Design** – Small device that can fit inside **any helmet** without modifications.

---

## 📂 Repository Structure

Smart-Helmet-Accident-Drowsiness-Detection/
│
├── README.md # Project overview (this file)
│
├── Arduino/ # Arduino + ESP32 Code
│ ├── SmartHelmet.ino # Main program file
│
├── Backend/ # Node.js Backend for alerts
│ ├── server.js
│ ├── routes/
│ └── package.json
│
├── Dashboard/ # React Frontend Dashboard
│ ├── src/
│ │ ├── App.js
│ │ ├── components/
│ │ └── data/
│ └── public/
│
├── Data/ # Sample logs /
│ └── example_data.csv
│
└── Images/ # Project visuals
├── Helmet_3D.png
└── Circuit_Diagram.jpg



---

## 🛠️ Hardware Components
- ESP32 Development Board  
- MPU6050 (Accelerometer + Gyroscope)  
- IR Sensor (Eye state detection)  
- GPS Module (TinyGPS++)  
- Push Button (short press = cancel alarm, long press = SOS)  
- Active Buzzer  
- Battery Pack  
- Helmet (any standard helmet)  

---

## ⚙️ Software & Tools
- **Arduino IDE** – for ESP32 code  
- **Node.js + Express** – backend server  
- **React.js** – dashboard frontend  
- **Twilio WhatsApp API** – for accident alerts  
- **Brevo SMTP API** – for email notifications  
- **Google Colab** – model training (eye detection)  

---

## 🚀 How It Works
1. Helmet continuously monitors **acceleration & orientation**.  
2. IR sensor checks **eye state** for drowsiness.  
3. On detecting accident/drowsiness:  
   - Buzzer triggers alarm  
   - If not canceled by button → Alert is sent to backend  
4. Backend pushes alerts via **WhatsApp / Email** with **GPS location**.  
5. Data is shown on the **React Dashboard** for monitoring.  

---

## 📌 Future Enhancements
- AI-based **image processing** for advanced drowsiness detection  
- **Battery optimization** for long rides  
- Integration with **smart traffic systems** for faster emergency response  

---

## 📸 Images & Demo
> Add circuit diagrams, helmet images, or dashboard screenshots here.

---

## 🤝 Contribution
Feel free to fork this repo, open issues, or suggest improvements. Collaboration is always welcome!  

---

## 📧 Contact
Created by **Praveen**  
For queries/collaboration: *[add your email or LinkedIn link]*  

---

## 🏷️ Tags
`IoT` `Smart Helmet` `ESP32` `ReactJS` `Node.js` `WearableTech` `Rider Safety` `Accident Detection` `Drowsiness Detection`

