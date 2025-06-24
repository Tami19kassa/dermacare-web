import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Type Definitions ---
export interface Prediction {
    condition: string;
    confidence: number;
}
interface RoboflowPrediction {
    class: string;
    confidence: number;
}

// --- Roboflow API Configuration ---
// These details come from your working Roboflow snippet
const ROBOFLOW_API_URL = "https://serverless.roboflow.com/vitiligo-classification-kcq5o/4";
const ROBOFLOW_API_KEY = "lVvj3gMIl3c9TSv4rPKu";


// A helper function to upload the image and get its public URL
const uploadImageAndGetURL = async (uid: string, imageFile: File): Promise<string> => {
    const filePath = `scans/${uid}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
};


// The main function to perform the scan
export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) { toast.error("You must be logged in."); return null; }

    const toastId = toast.loading('Uploading image...');

    try {
        // 1. Upload to Firebase first to get the URL
        const imageUrl = await uploadImageAndGetURL(user.uid, imageFile);

        toast.loading('Model is analyzing...', { id: toastId });

        // 2. Call Roboflow API with the public URL
        const response = await axios({
            method: "POST",
            url: ROBOFLOW_API_URL,
            params: {
                api_key: ROBOFLOW_API_KEY,
                image: imageUrl
            },
            timeout: 90000 // 90-second timeout
        });
        
        // 3. Parse the response
        if (!response.data || !response.data.predictions || response.data.predictions.length === 0) {
            throw new Error("Analysis did not return any valid predictions.");
        }
        
        const topPrediction: RoboflowPrediction = response.data.predictions[0];
        const result: Prediction = {
            condition: topPrediction.class,
            confidence: topPrediction.confidence,
        };
        
        if (!result.condition || typeof result.confidence !== 'number') {
            throw new Error("Received an invalid prediction format from the API.");
        }
        
        // 4. Show the success toast BEFORE trying to save
        toast.success(`Result: ${result.condition}`, { id: toastId });
        
        // 5. Save the result to Firestore. This happens after the user gets feedback.
        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100,
        });

        // The 'Saving...' toast is no longer needed because we show success immediately.
        
        return result;

    } catch (error: any) {
        console.error("Scan failed:", error);
        // Better error message
        const errorMessage = error.response?.data?.message || "An analysis error occurred. The server may be busy.";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};