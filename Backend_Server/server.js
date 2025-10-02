const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const app = express()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: "https://smart-helmet-woad.vercel.app",
    credentials: true,
  })
)
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// Routes
const alertRoutes = require("./routes/alerts")
const deviceRoutes = require("./routes/device")
const sosRoutes = require("./routes/sos")

app.use("/api", alertRoutes)
app.use("/api", deviceRoutes)
app.use("/api", sosRoutes)

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

module.exports = app
