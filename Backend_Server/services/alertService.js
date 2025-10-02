const { initializeFirebase } = require("../config/firebase")

let db
try {
  db = initializeFirebase()
} catch (error) {
  console.error("Failed to initialize Firebase:", error)
}

const ALERTS_PATH = "alerts"
const STATUS_PATH = "status"
const MAX_ALERTS = 100

const getLatestAlerts = async () => {
  try {
    if (!db) throw new Error("Firebase not initialized")

    // Get alerts (limited to last 50, ordered by timestamp)
    const alertsSnapshot = await db.ref(ALERTS_PATH).orderByChild("timestamp").limitToLast(50).once("value")

    // Get current status
    const statusSnapshot = await db.ref(STATUS_PATH).once("value")

    const alertsData = alertsSnapshot.val() || {}
    const statusData = statusSnapshot.val() || {
      helmet: "connected",
      accident: false,
      fatigue: "normal",
      location: null,
      lastUpdate: new Date().toISOString(),
    }

    // Convert alerts object to array and sort by timestamp (newest first)
    const alertsArray = Object.keys(alertsData)
      .map((key) => ({
        id: key,
        ...alertsData[key],
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return {
      alerts: alertsArray,
      status: statusData,
    }
  } catch (error) {
    console.error("Error fetching alerts from Firebase:", error)
    throw error
  }
}

const addAlert = async (alertData) => {
  try {
    if (!db) throw new Error("Firebase not initialized")

    const alert = {
      ...alertData,
      timestamp: alertData.timestamp || new Date().toISOString(),
    }

    // Add alert to Firebase with auto-generated key
    const alertRef = await db.ref(ALERTS_PATH).push(alert)
    const alertId = alertRef.key

    // Clean up old alerts (keep only MAX_ALERTS)
    await cleanupOldAlerts()

    // Update last update time in status
    await db.ref(`${STATUS_PATH}/lastUpdate`).set(new Date().toISOString())

    console.log(`New alert added to Firebase: ${alert.type} - ${alert.message}`)

    return {
      id: alertId,
      ...alert,
    }
  } catch (error) {
    console.error("Error adding alert to Firebase:", error)
    throw error
  }
}

const updateStatus = async (statusUpdate) => {
  try {
    if (!db) throw new Error("Firebase not initialized")

    const updatedStatus = {
      ...statusUpdate,
      lastUpdate: new Date().toISOString(),
    }

    // Update status in Firebase
    await db.ref(STATUS_PATH).update(updatedStatus)

    console.log("Status updated in Firebase:", updatedStatus)
    return updatedStatus
  } catch (error) {
    console.error("Error updating status in Firebase:", error)
    throw error
  }
}

const clearAlerts = async () => {
  try {
    if (!db) throw new Error("Firebase not initialized")

    await db.ref(ALERTS_PATH).remove()
    console.log("All alerts cleared from Firebase")
  } catch (error) {
    console.error("Error clearing alerts from Firebase:", error)
    throw error
  }
}

// Helper function to clean up old alerts
const cleanupOldAlerts = async () => {
  try {
    const alertsSnapshot = await db.ref(ALERTS_PATH).orderByChild("timestamp").once("value")

    const alertsData = alertsSnapshot.val() || {}
    const alertKeys = Object.keys(alertsData)

    if (alertKeys.length > MAX_ALERTS) {
      // Sort by timestamp and get oldest alerts to remove
      const sortedAlerts = alertKeys
        .map((key) => ({
          key,
          timestamp: alertsData[key].timestamp,
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

      const alertsToRemove = sortedAlerts.slice(0, alertKeys.length - MAX_ALERTS)

      // Remove old alerts
      const updates = {}
      alertsToRemove.forEach((alert) => {
        updates[`${ALERTS_PATH}/${alert.key}`] = null
      })

      await db.ref().update(updates)
      console.log(`Cleaned up ${alertsToRemove.length} old alerts`)
    }
  } catch (error) {
    console.error("Error cleaning up old alerts:", error)
  }
}

// Initialize default status if it doesn't exist
const initializeDefaultStatus = async () => {
  try {
    if (!db) return

    const statusSnapshot = await db.ref(STATUS_PATH).once("value")
    if (!statusSnapshot.exists()) {
      const defaultStatus = {
        helmet: "connected",
        accident: false,
        fatigue: "normal",
        location: null,
        lastUpdate: new Date().toISOString(),
      }
      await db.ref(STATUS_PATH).set(defaultStatus)
      console.log("Default status initialized in Firebase")
    }
  } catch (error) {
    console.error("Error initializing default status:", error)
  }
}

// Initialize default status on module load
initializeDefaultStatus()

module.exports = {
  getLatestAlerts,
  addAlert,
  updateStatus,
  clearAlerts,
}
