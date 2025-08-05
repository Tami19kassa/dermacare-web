 import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from './firestoreService';
import toast from 'react-hot-toast';
 
import { runPrediction } from './tfjsService';
 
export interface Prediction {
    condition: string;
    confidence: number;
    id?: string;  
}
 
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
 
export const saveScanToHistory = async (imageFile: File, topPrediction: Prediction) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You must be logged in to save history.");
    }
   
    const filePath = `scans/${user.uid}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);
 
    await addScanResult(user.uid, {
        imageUrl: imageUrl,
        condition: topPrediction.condition,
        confidence: topPrediction.confidence * 100,  
    });
};