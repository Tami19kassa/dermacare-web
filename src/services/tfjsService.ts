import * as tf from '@tensorflow/tfjs';
import { type Prediction } from './predictionService';

// Ensure the labels are in the correct order as during training.
const labels = [
    "Acne And Rosacea",
    "Ba Impetigo",
    "Eczema",
    "Fu Ringworm",
    "Healthy", // Corrected the typo from 'Heathy'
    "Healthy Skin",
    "Psoriasis Pictures Lichen Planus And Related Diseases",
    "Urticaria Hives",
    "Vi Shingles",
    "Warts Molluscum And Other Viral Infections",
    "Vitiligo" // Capitalized for consistency
];

let modelPromise: Promise<tf.GraphModel> | null = null;
// In your Vite/React project's JavaScript file

export const initializeModel = (): Promise<tf.GraphModel> => {
    if (!modelPromise) {
        console.log('Initializing TF.js model from GitHub...');
        
        // This is your specific, correct URL
        const GITHUB_MODEL_URL = 'https://cdn.jsdelivr.net/gh/abate1162/bn/final_tfjs_model/model.json';
        
        modelPromise = tf.loadGraphModel(GITHUB_MODEL_URL);
        
        modelPromise.then(() => console.log('✅ TF.js model loaded successfully!'))
                   .catch(err => {
                      console.error('🔥 Failed to load model:', err);
                      modelPromise = null; 
                   });
    }
    return modelPromise;
};

/**
 * Runs a prediction using the TF.js API with robust preprocessing.
 */
// --- CORRECTED runPrediction FUNCTION ---

export const runPrediction = async (imageFile: File): Promise<Prediction[] | null> => {
    if (!modelPromise) {
        throw new Error('Model not initialized. Call initializeModel() first.');
    }

    const model = await modelPromise;
    const imageElement = document.createElement('img');
    imageElement.src = URL.createObjectURL(imageFile);
    
    await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
    });

    const tensor = tf.tidy(() => {
        // 1. Create a tensor from the image element [0, 255]
        const imgTensor = tf.browser.fromPixels(imageElement);

        // 2. Resize to the model's expected input size (128x128)
        const resizedTensor = tf.image.resizeBilinear(imgTensor, [128, 128]);

        // 3. Normalize the pixel values from [0, 255] to [0, 1]
        //    THIS IS THE CRITICAL FIX!
        const floatTensor = resizedTensor.toFloat();

        // 4. Add a batch dimension to match the model's input shape [1, 128, 128, 3]
        return floatTensor.expandDims();
    });

    // Run the model prediction
    const result = model.predict(tensor) as tf.Tensor;
    const rawPredictions = await result.data() as Float32Array;

    // ... (rest of your code is fine) ...
    const processedPredictions = Array.from(rawPredictions)
        .map((confidence, index) => ({
            id: labels[index] || 'unknown',
            condition: labels[index] || 'unknown',
            confidence: confidence
        }))
        .sort((a, b) => b.confidence - a.confidence);

    // Clean up resources
    tensor.dispose();
    result.dispose();
    URL.revokeObjectURL(imageElement.src);

    return processedPredictions.slice(0, 3);
};