import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Type Definitions for clarity and type safety ---
interface HfPrediction {
    label: string;
    conf: number;
}
export interface Prediction {
    condition: string;
    confidence: number;
}

// --- API Configuration ---
// This is the public API endpoint for your Hugging Face Space.
const HUGGING_FACE_API_URL = "https://tamikassa84-dermacare-skin-analyzer.hf.space/run/predict";


// Helper function to convert a File object into a base64 string
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


/**
 * Performs the end-to-end skin analysis by calling the public Hugging Face API.
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
        // 1. Convert the image to a base64 string for the API payload.
        const base64Image = await toBase64(imageFile);

        // 2. Call the public Hugging Face API Endpoint.
        // No Authorization header is needed since the Space is public.
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            {
                // The Gradio API expects data in this specific format: { "data": [...] }
                data: [base64Image],
            },
            {
                // A long timeout is still a good idea in case the Space is "waking up".
                timeout: 90000 
            }
        );

        // 3. Process the response from the API.
        const predictions = response.data.data[0].confidences as HfPrediction[];
        if (!predictions || predictions.length === 0) {
            throw new Error("Analysis did not return any predictions.");
        }

        // 4. Extract the top prediction from the results.
        const topPrediction = predictions[0];
        const result: Prediction = {
            condition: topPrediction.label,
            confidence: topPrediction.conf,
        };
        
        toast.loading('Saving result to your history...', { id: toastId });

        // 5. In parallel, upload the original image to Firebase Storage.
        const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // 6. Save the final result (including the storage URL) to your Firestore database.
        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100,
        });

        toast.success(`Result: ${result.condition}`, { id: toastId });
        return result;

    } catch (error: any) {
        console.error("Full scan error object:", error);
        const errorMessage = error.response?.data?.error || "An error occurred during the scan. The model may be starting up.";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};