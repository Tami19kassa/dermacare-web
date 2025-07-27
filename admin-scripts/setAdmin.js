// admin-scripts/setAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Download this from Firebase project settings

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const userEmailToMakeAdmin = 'your-admin-email@example.com';

async function setAdminClaim() {
  try {
    const user = await admin.auth().getUserByEmail(userEmailToMakeAdmin);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set admin claim for ${userEmailToMakeAdmin}`);
  } catch (error) {
    console.error('Error setting custom claim:', error);
  }
}

setAdminClaim();