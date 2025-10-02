const express = require("express")
const router = express.Router()
const { getLatestAlerts, addAlert } = require("../services/alertService")

// GET /api/alerts - Get latest alerts and status
router.get("/alerts", async (req, res) => {
  try {
    const data = await getLatestAlerts()
    res.json(data)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    res.status(500).json({ error: "Failed to fetch alerts" })
  }
})

// POST /api/alerts - Add new alert (for testing)
router.post("/alerts", async (req, res) => {
  try {
    const { type, message, severity = "info" } = req.body

    if (!type || !message) {
      return res.status(400).json({ error: "Type and message are required" })
    }

    const alert = await addAlert({
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
    })

    res.status(201).json({ success: true, alert })
  } catch (error) {
    console.error("Error adding alert:", error)
    res.status(500).json({ error: "Failed to add alert" })
  }
})

module.exports = router
