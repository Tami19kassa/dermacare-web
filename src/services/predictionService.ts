import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
import axios from 'axios';

interface HfPrediction { label: string; conf: number; }
export interface Prediction { condition: string; confidence: number; }

// THE DEFAULT, CORRECT API URL
const HUGGING_FACE_API_URL = "https://tamikassa84-dermacare-skin-analyzer.hf.space/run/predict";
const HF_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN;
 
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export const performScan = async (imageFile: File): Promise<Prediction | null> => {
    const user = auth.currentUser;
    if (!user) { toast.error("You must be logged in."); return null; }
    if (!HF_TOKEN) { toast.error("API token not configured."); return null; }

    const toastId = toast.loading('Analyzing image...');

    try {
        const base64Image = await toBase64(imageFile);

        const response = await axios.post(
            HUGGING_FACE_API_URL, 
            { data: [base64Image] },
            {
                headers: { Authorization: `Bearer ${HF_TOKEN}` },
                timeout: 90000 
            }
        );

        const predictions = response.data.data[0].confidences as HfPrediction[];
        if (!predictions) throw new Error("Analysis returned no predictions.");

        const topPrediction = predictions[0];
        const result: Prediction = {
            condition: topPrediction.label,
            confidence: topPrediction.conf,
        };
        
        toast.loading('Saving result...', { id: toastId });

        const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        await addScanResult(user.uid, {
            imageUrl: imageUrl,
            condition: result.condition,
            confidence: result.confidence * 100,
        });
        
        toast.success(`Result: ${result.condition}`);
        return result;

    } catch (error: any) {
        console.error("Scan failed:", error);
        const errorMessage = error.response?.data?.error || "An error occurred. The model may be starting up.";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
};