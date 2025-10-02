const { addAlert }        = require("./alertService")
const { sendNotification } = require("./notificationService")

async function triggerSOS({ type, location, timestamp }) {
  // 1) persist the alert
  const alert = await addAlert({
    type:     "sos",
    message:  `SOS alert triggered (${type})`,
    severity: "critical",
    timestamp,
  })
  console.log(`🆘 Alert created: ${alert.id} (${type} at ${timestamp})`)

  // 2) send the WhatsApp notification
  const notificationResult = await sendNotification({
    type,
    message:  "EMERGENCY: SOS alert triggered by rider",
    location,
    alertId:  alert.id,
  })

  return {
    alertId: alert.id,
    notification: notificationResult,
  }
}

module.exports = { triggerSOS }
