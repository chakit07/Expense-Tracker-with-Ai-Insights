const admin = require('firebase-admin');

// Parse the service account JSON from the environment variable
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error.message);
  console.error('Ensure FIREBASE_SERVICE_ACCOUNT is set to a valid JSON string in backend/.env');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  console.error('Check your Firebase service account credentials');
  process.exit(1);
}

module.exports = admin;
