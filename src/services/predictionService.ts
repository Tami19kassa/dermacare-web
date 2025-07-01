// src/services/predictionService.ts

import { storage, auth } from '../firebase'; // Ensure this path is correct for your project
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService'; // Ensure this path is correct
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Type Definitions ---
// These can stay the same because we made our Python API return the same format!
export interface Prediction {
    condition: string;
    confidence: number;
}
interface ApiResponsePrediction {
    class: string;
    confidence: number;
}


// --- API Configuration ---
// We are now pointing to our own local Python/Flask server.
// No API key is needed!
const LIVE_API_URL = "https://dermacare-web-api.onrender.com/predict";
                         

// --- Helper Functions ---
// This upload function is still needed to save the image to Firebase AFTER prediction.
const uploadImageAndGetURL = async (uid: string, imageFile: File): Promise<string> => {
    const filePath = `scans/${uid}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
};


// --- Main Service Function ---
/**
 * Performs the entire scan process by calling the LOCAL Python server:
 * 1. Sends the image file directly to the server.
 * 2. Shows the result to the user immediately.
 * 3. In the background, uploads the image to Firebase and saves the result to Firestore.
 * @param imageFile The image file selected by the user.
 * @returns The top prediction or null if the scan failed.
 */
export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) {
        toast.error("You must be logged in to perform a scan.");
        return null;
    }

    const toastId = toast.loading('Analyzing image...');

    try {
        // 1. Create a FormData object to send the file.
        //    This is the standard way to upload files from a browser.
        const formData = new FormData();
        formData.append('file', imageFile);

        // 2. Call your LOCAL Flask API.
        const response = await axios({
            method: "POST",
            url:  LIVE_API_URL,
            data: formData, // Send the file as form data
            headers: {
                // This header is crucial for file uploads
                "Content-Type": "multipart/form-data",
            },
            timeout: 90000 
        });
        
        // 3. Gracefully handle the case where the model returns no predictions.
        if (!response.data || !response.data.predictions || response.data.predictions.length === 0) {
            toast.error("Could not identify a condition. Please try a clearer image.", { id: toastId });
            return null;
        }
        
        // 4. Parse the valid prediction (the format is the same as before).
        const topPrediction: ApiResponsePrediction = response.data.predictions[0];
        const result: Prediction = {
            condition: topPrediction.class,
            confidence: topPrediction.confidence,
        };
        
        // 5. Show the success result to the user.
        toast.success(`Result: ${result.condition}`, { id: toastId });
        
        // 6. Perform background tasks.
        console.log("Saving scan history in the background...");
        const imageUrl = await uploadImageAndGetURL(user.uid, imageFile);
        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100,
        });
        console.log("Scan history saved successfully.");

        return result;

    } catch (error: any) {
        console.error("Full scan error details:", error);
        
        // Improved error message for local server issues
        let errorMessage = "An analysis error occurred.";
        if (error.code === 'ERR_NETWORK') {
            errorMessage = "Could not connect to the analysis server. Is it running?";
        }
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};