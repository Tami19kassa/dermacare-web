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

// --- Roboflow API Configuration from your documentation ---
const ROBOFLOW_API_URL = "https://serverless.roboflow.com/vitiligo-classification-kcq5o/4";
const ROBOFLOW_API_KEY = "lVvj3gMIl3c9TSv4rPKu"; // Using the key from your example


export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) { toast.error("You must be logged in."); return null; }
    if (!ROBOFLOW_API_KEY) { toast.error("API key not configured."); return null; }

    const toastId = toast.loading('Analyzing image...');
    try {
        const imageUrl = await uploadImageAndGetURL(user.uid, imageFile);

        toast.loading('Model is processing...', { id: toastId });

        const response = await axios({
            method: "POST",
            url: ROBOFLOW_API_URL,
            params: { api_key: ROBOFLOW_API_KEY, image: imageUrl },
        });

        // --- THIS IS THE CORRECTED PARSING LOGIC ---
        if (!response.data || !response.data.predictions || response.data.predictions.length === 0) {
            throw new Error("Analysis did not return any predictions.");
        }
        
        // Roboflow returns an array of predictions, sorted by confidence.
        // The top one is the first element.
        const topPrediction = response.data.predictions[0];
        
        // The properties are 'class' and 'confidence'.
        const result: Prediction = {
            condition: topPrediction.class,
            confidence: topPrediction.confidence,
        };
        
        // Add a final safety check before saving
        if (!result.condition || typeof result.confidence !== 'number') {
            throw new Error("Received an invalid prediction format from the API.");
        }
        
        toast.loading('Saving result...', { id: toastId });

        // Now we can save with confidence that the data is not undefined.
        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100,
        });

        toast.success(`Result: ${result.condition}`);
        return result;

    } catch (error: any) {
        console.error("Scan failed:", error);
        const errorMessage = error.response?.data?.message || "An error occurred during analysis.";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};

// A helper function to keep the code clean
const uploadImageAndGetURL = async (uid: string, imageFile: File): Promise<string> => {
    const filePath = `scans/${uid}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
};