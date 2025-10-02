const twilio = require("twilio")
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Hard-coded Twilio WhatsApp sandbox number and your joined number
const TWILIO_WHATSAPP_NUMBER   = "whatsapp:+14155238886"
const RECEIVER_WHATSAPP_NUMBER = "whatsapp:+919893423647"

async function sendNotification({ type, message, location, alertId }) {
  // Build the full message
  // If we have a location object with lat & lng, build a Google Maps link
  let locationText = "Location: not provided"
  if (location && typeof location.lat === "number" && typeof location.lng === "number") {
    const { lat, lng } = location
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`
    locationText = `Location: ${mapsUrl}`
  }

  const fullMessage = [
    "🚨 SMART HELMET ALERT 🚨",
    message,
    locationText,
    `Alert ID: ${alertId}`,
    `Time: ${new Date().toLocaleString()}`,
  ].join("\n\n")

  try {
    console.log("▶️ Sending WhatsApp to:", RECEIVER_WHATSAPP_NUMBER)
    const result = await client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to:   RECEIVER_WHATSAPP_NUMBER,
      body: fullMessage,
    })
    console.log("✅ WhatsApp sent, SID:", result.sid)
    return { success: true, sid: result.sid }
  } catch (err) {
    console.error("❌ WhatsApp failed:", err)
    return { success: false, error: err.message }
  }
}

module.exports = { sendNotification }

