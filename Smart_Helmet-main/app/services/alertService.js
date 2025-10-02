import axios from "axios"

const API_BASE_URL = "https://smart-helmet-server-ebon.vercel.app/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const alertService = {
  // Get latest alerts and status
  async getLatestAlerts() {
    try {
      const response = await api.get("/alerts")
      return response.data
    } catch (error) {
      console.error("Error fetching alerts:", error)
      throw error
    }
  },

  // Trigger manual SOS
  async triggerSOS() {
    try {
      const response = await api.post("/sos", {
        timestamp: new Date().toISOString(),
        type: "manual",
      })
      return response.data
    } catch (error) {
      console.error("Error triggering SOS:", error)
      throw error
    }
  },

  // Send device data (for testing purposes)
  async sendDeviceData(data) {
    try {
      const response = await api.post("/device-data", data)
      return response.data
    } catch (error) {
      console.error("Error sending device data:", error)
      throw error
    }
  },
}
