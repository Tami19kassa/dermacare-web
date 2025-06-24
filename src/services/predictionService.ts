import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
import axios from 'axios';

// Define the shape of the data we will work with for type safety
export interface Prediction {
    condition: string;
    confidence: number;
}

 
const FUNCTION_URL = "/.netlify/functions/analyzeImage";

/**
 * A helper function to convert a File object into a base64 string,
 * which can be sent in a JSON payload to our serverless function.
 * @param file The image file selected by the user.
 * @returns A promise that resolves to a base64 encoded string.
 */
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


/**
 * Performs the end-to-end skin analysis by calling the Netlify function.
 * @param imageFile The image file uploaded by the user.
 * @returns A promise that resolves to a Prediction object, or null if an error occurs.
 */
export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) {
        toast.error("You must be logged in to perform a scan.");
        return null;
    }

    const toastId = toast.loading('Analyzing image...');

    try {
        // 1. Convert the image to a base64 string to send in the request.
        const base64Image = await toBase64(imageFile);

        // 2. Call the Netlify serverless function via a POST request.
        const response = await axios.post(
            FUNCTION_URL,
            // The body of the request is a JSON object with the image data
            { image: base64Image },
            // Set a generous timeout to allow for function "cold starts"
            { timeout: 90000 } 
        );
        
        // 3. The function returns the prediction result in the response body.
        const result = response.data as Prediction;

        if (!result || !result.condition) {
            throw new Error("Analysis failed to return a valid result.");
        }

        toast.loading('Saving result to your history...', { id: toastId });

        // 4. In parallel, upload the original image to Firebase Storage for record-keeping.
        const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // 5. Save the prediction data and the new image URL to Firestore.
        await addScanResult(user.uid, {
            imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100, // Convert from 0.92 to 92.0
        });
        
        // 6. Show the final success message.
        toast.success(`Result: ${result.condition}`);
        return result;

    } catch (error: any) {
        console.error("Scan failed:", error);
        // Display a helpful error message to the user.
        const errorMessage = error.response?.data?.error || "An error occurred during the scan.";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};