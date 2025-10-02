const { addAlert, updateStatus } = require("./alertService")
const { sendNotification } = require("./notificationService")
const { initializeFirebase } = require("../config/firebase")

let db
try {
  db = initializeFirebase()
} catch (error) {
  console.error("Failed to initialize Firebase:", error)
}

// Debounce mechanism using Firebase
const DEBOUNCE_PATH = "debounce"
const DEBOUNCE_TIME = 30000 // 30 seconds

const processDeviceData = async (deviceData) => {
  const { deviceId, timestamp, helmetStatus, accelerometer, gyroscope, heartRate, location, batteryLevel } = deviceData

  let alertsTriggered = 0
  const alerts = []

  try {
    // Store raw device data in Firebase for historical tracking
    await storeDeviceData(deviceData)

    // Process helmet connection status
    if (helmetStatus !== undefined) {
      const status = helmetStatus ? "connected" : "disconnected"
      await updateStatus({ helmet: status })

      if (!helmetStatus && !(await isDebounced("helmet_disconnect", deviceId))) {
        const alert = await addAlert({
          type: "helmet",
          message: "Helmet disconnected - check device connection",
          severity: "warning",
          deviceId,
        })
        alerts.push(alert)
        alertsTriggered++
        await setDebounce("helmet_disconnect", deviceId)
      }
    }

    // Process accident detection (based on accelerometer/gyroscope data)
    if (accelerometer || gyroscope) {
      const accidentDetected = detectAccident(accelerometer, gyroscope)
      await updateStatus({ accident: accidentDetected })

      if (accidentDetected && !(await isDebounced("accident", deviceId))) {
        const alert = await addAlert({
          type: "accident",
          message: "ACCIDENT DETECTED - Emergency protocols activated",
          severity: "critical",
          deviceId,
          location,
        })
        alerts.push(alert)
        alertsTriggered++
        await setDebounce("accident", deviceId)

        // Send emergency notification
        await sendNotification({
          type: "accident",
          message: "Emergency: Accident detected for rider",
          location: location,
          deviceId,
        })
      }
    }

    // Process fatigue detection (based on heart rate and other factors)
    if (heartRate !== undefined) {
      const fatigueLevel = detectFatigue(heartRate, deviceData)
      await updateStatus({ fatigue: fatigueLevel })

      if (fatigueLevel === "critical" && !(await isDebounced("fatigue_critical", deviceId))) {
        const alert = await addAlert({
          type: "fatigue",
          message: "Critical fatigue detected - immediate rest required",
          severity: "warning",
          deviceId,
        })
        alerts.push(alert)
        alertsTriggered++
        await setDebounce("fatigue_critical", deviceId)
      }
    }

    // Update location
    if (location) {
      await updateStatus({ location })
    }

    // Log battery level if low
    if (batteryLevel !== undefined && batteryLevel < 20 && !(await isDebounced("low_battery", deviceId))) {
      const alert = await addAlert({
        type: "system",
        message: `Low battery warning: ${batteryLevel}% remaining`,
        severity: "info",
        deviceId,
      })
      alerts.push(alert)
      alertsTriggered++
      await setDebounce("low_battery", deviceId)
    }

    console.log(`Processed device data from ${deviceId}, triggered ${alertsTriggered} alerts`)

    return {
      success: true,
      alertsTriggered,
      alerts,
    }
  } catch (error) {
    console.error("Error processing device data:", error)
    throw error
  }
}

// Store raw device data for historical analysis
const storeDeviceData = async (deviceData) => {
  try {
    if (!db) return

    const deviceDataPath = `deviceData/${deviceData.deviceId}`
    const timestamp = new Date().toISOString()

    await db.ref(`${deviceDataPath}/${timestamp.replace(/[.#$[\]]/g, "_")}`).set({
      ...deviceData,
      receivedAt: timestamp,
    })

    // Keep only last 100 entries per device
    const snapshot = await db.ref(deviceDataPath).limitToLast(100).once("value")
    const data = snapshot.val() || {}
    const keys = Object.keys(data)

    if (keys.length > 100) {
      const oldKeys = keys.slice(0, keys.length - 100)
      const updates = {}
      oldKeys.forEach((key) => {
        updates[`${deviceDataPath}/${key}`] = null
      })
      await db.ref().update(updates)
    }
  } catch (error) {
    console.error("Error storing device data:", error)
  }
}

// Firebase-based debounce functions
const isDebounced = async (alertType, deviceId) => {
  try {
    if (!db) return false

    const key = `${alertType}_${deviceId}`
    const snapshot = await db.ref(`${DEBOUNCE_PATH}/${key}`).once("value")
    const lastAlert = snapshot.val()

    if (!lastAlert) return false

    return Date.now() - lastAlert < DEBOUNCE_TIME
  } catch (error) {
    console.error("Error checking debounce:", error)
    return false
  }
}

const setDebounce = async (alertType, deviceId) => {
  try {
    if (!db) return

    const key = `${alertType}_${deviceId}`
    await db.ref(`${DEBOUNCE_PATH}/${key}`).set(Date.now())

    // Clean up after debounce time
    setTimeout(async () => {
      try {
        await db.ref(`${DEBOUNCE_PATH}/${key}`).remove()
      } catch (error) {
        console.error("Error cleaning up debounce:", error)
      }
    }, DEBOUNCE_TIME)
  } catch (error) {
    console.error("Error setting debounce:", error)
  }
}

// Simple accident detection algorithm
const detectAccident = (accelerometer, gyroscope) => {
  if (!accelerometer) return false

  const { x = 0, y = 0, z = 0 } = accelerometer
  const totalAcceleration = Math.sqrt(x * x + y * y + z * z)

  // Threshold for accident detection (adjust based on real-world testing)
  const ACCIDENT_THRESHOLD = 15 // m/s²

  return totalAcceleration > ACCIDENT_THRESHOLD
}

// Simple fatigue detection algorithm
const detectFatigue = (heartRate, deviceData) => {
  if (!heartRate) return "normal"

  // Basic fatigue detection based on heart rate patterns
  // In real implementation, this would be more sophisticated
  if (heartRate < 50 || heartRate > 120) {
    return "critical"
  } else if (heartRate < 60 || heartRate > 100) {
    return "tired"
  }

  return "normal"
}

module.exports = {
  processDeviceData,
}
