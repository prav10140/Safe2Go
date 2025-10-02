const express = require("express")
const router  = express.Router()
const { processDeviceData } = require("../services/deviceService")

// POST /api/device-data — Receive data from smart helmet device
router.post("/device-data", async (req, res) => {
  try {
    const { deviceId, timestamp, lat, lng, ...rest } = req.body

    // Validate required fields
    const requiredFields = ["deviceId", "timestamp", "lat", "lng"]
    const missingFields = requiredFields.filter((f) => req.body[f] === undefined)

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      })
    }

    // Build a deviceData object
    const deviceData = {
      deviceId,
      timestamp,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      ...rest, // any other sensor data you might send
    }

    // Process the device data (e.g., save to DB, trigger alerts)
    const result = await processDeviceData(deviceData)

    res.json({
      success: true,
      message: "Device data processed successfully",
      alertsTriggered: result.alertsTriggered || 0,
    })
  } catch (error) {
    console.error("Error processing device data:", error)
    res.status(500).json({ error: "Failed to process device data" })
  }
})

module.exports = router

