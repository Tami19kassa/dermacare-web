import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Type Definitions ---
interface HfPrediction { label: string; conf: number; }
export interface Prediction { condition: string; confidence: number; }

// --- Hugging Face API Configuration ---
const HUGGING_FACE_API_URL ="https:tamikassa84-dermacare-skin-analyzer.hf.space/run/predict";
const HF_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN;

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) {
        toast.error("You must be logged in to perform a scan.");
        return null;
    }

    // This check will now succeed because the variable is in your .env file
    if (!HF_TOKEN) {
        toast.error("API token is not configured.");
        console.error("VITE_HUGGING_FACE_TOKEN is missing from .env file!");
        return null;
    }

    const toastId = toast.loading('Analyzing image...');

    try {
        const base64Image = await toBase64(imageFile);

        // This is the correct API call for a Hugging Face Space endpoint
        const response = await axios.post(
            HUGGING_FACE_API_URL, 
            { data: [base64Image] }, // The data payload for Gradio
            {
                headers: {
                    // The authorization header is required for private spaces
                    Authorization: `Bearer ${HF_TOKEN}`
                },
                timeout: 90000 // 90 second timeout to allow the Space to wake up
            }
        );

        const predictions = response.data.data[0].confidences as HfPrediction[];
        if (!predictions || predictions.length === 0) {
            throw new Error("Analysis did not return any predictions.");
        }

        const topPrediction = predictions[0];
        const result: Prediction = {
            condition: topPrediction.label,
            confidence: topPrediction.conf,
        };
        
        toast.loading('Saving result...', { id: toastId });

        // Save the result to your Firebase backend
        const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100,
        });

        toast.success(`Result: ${result.condition}`, { id: toastId });
        return result;

    } catch (error: any) {
        console.error("Scan failed:", error);
        const errorMessage = error.response?.data?.error || "An error occurred. The model may be starting up.";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};