// src/services/predictionService.ts

import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';

// Import our local model's prediction function
import { runPrediction } from './tfjsService';

// This is the updated, shared type definition for a prediction result
export interface Prediction {
    condition: string;
    confidence: number;
    id?: string; // The special ID for handling logic (e.g., 'malignant_lesion')
}

/**
 * 1. PERFORMS A SCAN USING THE LOCAL TENSORFLOW.JS MODEL
 * This function gets the analysis from the browser, not an external API.
 * @param imageFile The image file selected by the user.
 * @returns An array of the top 3 predictions, or null on failure.
 */
export const performScan = async (imageFile: File): Promise<Prediction[] | null> => {
    try {
        const results = await runPrediction(imageFile);
        
        if (!results || results.length === 0) {
            toast.error("Could not identify a condition from the image.");
            return null;
        }

        return results;

    } catch (error: any) {
        console.error("Local scan error:", error);
        toast.error(error.message || "An unexpected analysis error occurred.");
        return null;
    }
};

/**
 * 2. SAVES A SCAN RESULT TO HISTORY
 * (This function does not need any changes)
 * @param imageFile The original image file.
 * @param topPrediction The single best prediction to save.
 */
export const saveScanToHistory = async (imageFile: File, topPrediction: Prediction) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You must be logged in to save history.");
    }
    
    // Upload image to Firebase Storage to get the URL
    const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    // Save the complete record to Firestore
    await addScanResult(user.uid, {
        imageUrl: imageUrl,
        condition: topPrediction.condition,
        confidence: topPrediction.confidence * 100, // Save confidence as a percentage
    });
};