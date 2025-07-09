// src/services/tfjsService.ts

// Step 1: Import the necessary libraries
import * as tf from '@tensorflow/tfjs'; // Still needed as a dependency
import * as tmImage from '@teachablemachine/image'; // The new Teachable Machine library
import { type Prediction } from './predictionService';

// Step 2: Define the path to your model in the `public` folder
// This path is relative to the root of your web server.
const MODEL_URL = '/tm_model/'; // Path to the folder containing your model files

// Step 3: Modify the model initialization
let modelPromise: Promise<tmImage.CustomMobileNet> | null = null;

export const initializeModel = (): Promise<tmImage.CustomMobileNet> => {
  if (!modelPromise) {
    console.log('Initializing Teachable Machine model...');
    const modelURL = MODEL_URL + 'model.json';
    const metadataURL = MODEL_URL + 'metadata.json';
    
    // Use tmImage.load() which is designed for these models
    modelPromise = tmImage.load(modelURL, metadataURL);
    
    modelPromise
      .then(() => console.log('✅ Teachable Machine model loaded and ready!'))
      .catch(err => {
        console.error('🔥 Failed to load Teachable Machine model:', err);
        modelPromise = null; 
      });
  }
  return modelPromise;
};

/**
 * Runs a prediction using the Teachable Machine library, which simplifies preprocessing.
 */
export const runPrediction = async (imageFile: File): Promise<Prediction[] | null> => {
  if (!modelPromise) {
    throw new Error('Model not initialized. Call initializeModel() first.');
  }

  const model = await modelPromise;

  // Create an HTMLImageElement to pass to the model. The library handles the rest.
  const imageElement = document.createElement('img');
  imageElement.src = URL.createObjectURL(imageFile);
  await new Promise(resolve => (imageElement.onload = resolve));

  // --- The Teachable Machine library handles all preprocessing internally! ---
  // No need for canvas, manual tensor creation, or normalization.

  // Run the model prediction directly on the image element
  const predictionResult = await model.predict(imageElement);

  // Process the prediction results
  const processedPredictions = predictionResult
    .map(p => ({
      // The class name comes directly from the model's metadata
      condition: p.className,
      // The probability is the confidence score
      confidence: p.probability,
      // Create a URL-friendly ID from the class name for consistency
      id: p.className.toLowerCase().replace(/ /g, '_').replace(/[()]/g, '')
    }))
    .sort((a, b) => b.confidence - a.confidence);

  // Clean up the object URL
  URL.revokeObjectURL(imageElement.src);

  // Return the top 3 predictions
  return processedPredictions.slice(0, 3);
};