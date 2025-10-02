"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "../config/firebase"
import { ref, onValue, off } from "firebase/database"
import { alertService } from "../services/alertService"

const AlertContext = createContext()

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])
  const [currentStatus, setCurrentStatus] = useState({
    helmet: "connected",
    accident: false,
    fatigue: "normal",
    location: null,
    lastUpdate: null,
  })
  const [isEmergency, setIsEmergency] = useState(false)
  const [emergencyCountdown, setEmergencyCountdown] = useState(0)
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false)

  // Real-time Firebase listeners
  useEffect(() => {
    let alertsRef
    let statusRef

    const setupFirebaseListeners = () => {
      try {
        // Listen to alerts changes
        alertsRef = ref(database, "alerts")
        onValue(
          alertsRef,
          (snapshot) => {
            const alertsData = snapshot.val() || {}
            const alertsArray = Object.keys(alertsData)
              .map((key) => ({
                id: key,
                ...alertsData[key],
              }))
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 50) // Keep only last 50 alerts

            setAlerts(alertsArray)
            setIsFirebaseConnected(true)
          },
          (error) => {
            console.error("Error listening to alerts:", error)
            setIsFirebaseConnected(false)
          },
        )

        // Listen to status changes
        statusRef = ref(database, "status")
        onValue(
          statusRef,
          (snapshot) => {
            const statusData = snapshot.val()
            if (statusData) {
              setCurrentStatus(statusData)

              // Check for emergency conditions
              if (statusData.accident && !isEmergency) {
                triggerEmergency()
              }
            }
          },
          (error) => {
            console.error("Error listening to status:", error)
          },
        )
      } catch (error) {
        console.error("Error setting up Firebase listeners:", error)
        setIsFirebaseConnected(false)
        // Fallback to API polling if Firebase fails
        fallbackToApiPolling()
      }
    }

    // Fallback to API polling if Firebase is not available
    const fallbackToApiPolling = () => {
      console.log("Falling back to API polling...")
      const pollAlerts = async () => {
        try {
          const data = await alertService.getLatestAlerts()
          setAlerts(data.alerts || [])
          setCurrentStatus(data.status || currentStatus)

          // Check for emergency conditions
          if (data.status?.accident && !isEmergency) {
            triggerEmergency()
          }
        } catch (error) {
          console.error("Failed to fetch alerts:", error)
        }
      }

      pollAlerts() // Initial fetch
      const interval = setInterval(pollAlerts, 5000)

      return () => clearInterval(interval)
    }

    setupFirebaseListeners()

    // Cleanup function
    return () => {
      if (alertsRef) off(alertsRef)
      if (statusRef) off(statusRef)
    }
  }, [isEmergency])

  // Emergency countdown timer
  useEffect(() => {
    let timer
    if (emergencyCountdown > 0) {
      timer = setTimeout(() => {
        setEmergencyCountdown(emergencyCountdown - 1)
      }, 1000)
    } else if (emergencyCountdown === 0 && isEmergency) {
      // Auto-trigger SOS after countdown
      handleSOS()
    }

    return () => clearTimeout(timer)
  }, [emergencyCountdown, isEmergency])

  const triggerEmergency = () => {
    setIsEmergency(true)
    setEmergencyCountdown(30) // 30 second countdown
  }

  const cancelEmergency = () => {
    setIsEmergency(false)
    setEmergencyCountdown(0)
  }

  const handleSOS = async () => {
    try {
      await alertService.triggerSOS()
      setIsEmergency(false)
      setEmergencyCountdown(0)

      // SOS alert will be automatically added via Firebase listener
      console.log("SOS alert triggered successfully")
    } catch (error) {
      console.error("Failed to trigger SOS:", error)
    }
  }

  const value = {
    alerts,
    currentStatus,
    isEmergency,
    emergencyCountdown,
    isFirebaseConnected,
    triggerEmergency,
    cancelEmergency,
    handleSOS,
  }

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
