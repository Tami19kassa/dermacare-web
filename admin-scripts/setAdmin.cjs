
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');  

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const userEmailToMakeAdmin = 'dermacareteam@gmail.com';

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