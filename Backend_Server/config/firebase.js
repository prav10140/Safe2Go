const admin = require("firebase-admin")

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // For Vercel deployment, use environment variables
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Parse the service account from environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        })
      } else {
        // For local development, use service account file
        const serviceAccount = require("../firebase-service-account.json")

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        })
      }
    }

    console.log("Firebase Admin initialized successfully")
    return admin.database()
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    throw error
  }
}

module.exports = { initializeFirebase }
