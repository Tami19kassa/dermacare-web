import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import axios from 'axios';
import toast from 'react-hot-toast';

const PREDICTION_API_ENDPOINT = import.meta.env.VITE_PREDICTION_API_ENDPOINT;

interface Prediction {
    condition: string;
    confidence: number;
}

export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) {
        toast.error("You must be logged in to perform a scan.");
        return null;
    }

    const toastId = toast.loading('Uploading image...');

    try {
        // 1. Upload image to Firebase Storage
        const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        toast.loading('Analyzing image...', { id: toastId });

        // 2. Call your cloud prediction model
        // We send the public URL of the uploaded image to your model's API
        const response = await axios.post(PREDICTION_API_ENDPOINT, {
            imageUrl: imageUrl,
        });

        const prediction: Prediction = response.data; // Assuming your API returns { condition: "...", confidence: 0.92 }

        if (!prediction || !prediction.condition) {
            throw new Error("Analysis failed to return a valid result.");
        }
        
        toast.loading('Saving result...', { id: toastId });

        // 3. Save the result to Firestore
        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: prediction.condition,
            confidence: prediction.confidence * 100, // Convert 0.92 to 92
        });

        toast.success(`Result: ${prediction.condition}`, { id: toastId });
        return prediction;

    } catch (error: any) {
        console.error("Scan failed:", error);
        toast.error(error.message || "An error occurred during the scan.", { id: toastId });
        return null;
    }
};