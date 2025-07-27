import admin from 'firebase-admin';

// This function initializes the Firebase Admin SDK.
// It's designed to run only once to avoid re-initialization on every call.
const initializeFirebaseAdmin = () => {
  // Check if an app is already initialized.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Get the secret key from Vercel's Environment Variables.
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!serviceAccountBase64) {
    throw new Error('Firebase service account key is not set in environment variables.');
  }

  // Decode the Base64 string back into the original JSON string.
  const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('ascii');
  
  // Parse the JSON string into a JavaScript object.
  const serviceAccount = JSON.parse(serviceAccountJson);

  // Initialize the Firebase Admin SDK with the credentials.
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
};

/**
 * This is the Vercel Serverless Function handler.
 * It expects a POST request with a JSON body containing the email of the user to make an admin.
 */
export default async function handler(req, res) {
  // Ensure this is a POST request.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    initializeFirebaseAdmin(); // Make sure Firebase is initialized.

    // Get the email from the request body.
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required in the request body.' });
    }

    // Use the Firebase Admin SDK to find the user by their email.
    const user = await admin.auth().getUserByEmail(email);
    
    // Set the custom claim 'admin: true' on that user's account.
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    // Send a success response.
    return res.status(200).json({ message: `Successfully set admin claim for ${email}` });

  } catch (error) {
    console.error('Error in setAdmin API:', error);
    // Send a generic error response.
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}