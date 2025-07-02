// src/services/predictionService.ts


import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Type Definitions ---
// FIX: Added the 'export' keyword so other files can import this type.
export interface Prediction {
    condition: string;
    confidence: number;
}
// This interface is only used inside this file, so it doesn't need to be exported.
interface RoboflowPrediction {
    class: string;
    confidence: number;
}

// --- Roboflow API Configuration ---
const ROBOFLOW_API_URL = "https://serverless.roboflow.com/derma-net/3";
const ROBOFLOW_API_KEY = "UZumwpeO58u6QqmbEDeW";

// --- Helper Functions ---
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
    };
    reader.onerror = error => reject(error);
});

// --- Exported Service Functions ---

/**
 * 1. GETS PREDICTIONS FROM ROBOFLOW
 * This function ONLY gets the analysis. It does NOT save to the database.
 * @param imageFile The image file selected by the user.
 * @returns An array of the top 3 predictions, or null on failure.
 */
export const performScan = async (imageFile: File): Promise<Prediction[] | null> => {
    try {
        const base64Image = await toBase64(imageFile);
        const response = await axios({
            method: "POST",
            url: ROBOFLOW_API_URL,
            params: { api_key: ROBOFLOW_API_KEY },
            data: base64Image,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        
        if (!response.data || !response.data.predictions || response.data.predictions.length === 0) {
            toast.error("Could not identify a condition.");
            return null;
        }

        const predictions: RoboflowPrediction[] = response.data.predictions;
        const sortedPredictions = predictions.sort((a, b) => b.confidence - a.confidence);
        
        return sortedPredictions.slice(0, 3).map(p => ({
            condition: p.class,
            confidence: p.confidence
        }));

    } catch (error: any) {
        console.error("Full scan error details:", error);
        toast.error(error.response?.data?.message || "An unexpected analysis error occurred.");
        return null;
    }
};

/**
 * 2. SAVES A SCAN RESULT TO HISTORY
 * This function is called ONLY when the user clicks the "Save" button.
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

    // Save the complete record to Firestore using the function from firestoreService
    await addScanResult(user.uid, {
        imageUrl: imageUrl,
        condition: topPrediction.condition,
        confidence: topPrediction.confidence * 100,
    });
}; 