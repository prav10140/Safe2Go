const express = require("express")
const router  = express.Router()
const { triggerSOS } = require("../services/sosService")

// GET verify the endpoint is up
router.get("/sos", (req, res) => {
  res.json({ message: "SOS endpoint is alive – use POST to trigger alerts" })
})

// POST Trigger manual SOS
router.post("/sos", async (req, res) => {
  try {
    const { type = "manual", location } = req.body

    const result = await triggerSOS({
      type,
      location,
      timestamp: new Date().toISOString(),
    })

    res.json({
      success: true,
      message: "SOS alert triggered successfully",
      alertId: result.alertId,
    })
  } catch (error) {
    console.error("Error triggering SOS:", error)
    res.status(500).json({ error: "Failed to trigger SOS alert" })
  }
})

module.exports = router

