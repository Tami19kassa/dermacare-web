// src/services/tfjsService.ts
import * as tf from '@tensorflow/tfjs';
import { type Prediction } from './predictionService';
import { diseaseDatabase, getDiseaseById } from '../data/diseaseDatabase';

// Define the labels to match Flutter's 'labels21.txt' (21 classes)
// Note: Replace these with the exact labels from 'labels21.txt' in your Flutter assets
const labels = [
  "acne",
  "actinic_keratosis",
  "atopic_dermatitis",
  "bullous_disease",
  "cellulitis",
  "eczema",
  "herpes",
  "hives",
  "impetigo",
  "lupus",
  "malignant_lesion",
  "nail_fungus",
  "poison_ivy",
  "psoriasis",
  "ringworm",
  "scabies",
  "seborrheic_keratosis",
  "shingles",
  "vascular_tumor",
  "vasculitis",
  "warts"
];

// Initialize the model (unchanged)
let modelPromise: Promise<tf.GraphModel> | null = null;
export const initializeModel = (): Promise<tf.GraphModel> => {
  if (!modelPromise) {
    console.log('Initializing TF.js model...');
    modelPromise = tf.loadGraphModel('/tfjs_model/model.json');
    modelPromise.then(() => console.log('✅ TF.js model loaded and ready!'))
               .catch(err => {
                  console.error('🔥 Failed to load TF.js model:', err);
                  modelPromise = null; 
               });
  }
  return modelPromise;
};

/**
 * Runs a prediction using the "Manual Tensor" method to ensure consistency with Flutter.
 */
export const runPrediction = async (imageFile: File): Promise<Prediction[] | null> => {
  if (!modelPromise) {
    throw new Error('Model not initialized. Call initializeModel() first.');
  }
  
  const model = await modelPromise;
  const imageElement = document.createElement('img');
  imageElement.src = URL.createObjectURL(imageFile);
  await new Promise(resolve => imageElement.onload = resolve);

  // --- Preprocessing Pipeline (unchanged, matches Flutter) ---
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  ctx.drawImage(imageElement, 0, 0, 128, 128);
  const imageData = ctx.getImageData(0, 0, 128, 128);
  const rawPixelData = imageData.data;

  const float32Array = new Float32Array(128 * 128 * 3);
  for (let i = 0, j = 0; i < rawPixelData.length; i += 4, j += 3) {
    float32Array[j] = rawPixelData[i];       // R
    float32Array[j + 1] = rawPixelData[i + 1]; // G
    float32Array[j + 2] = rawPixelData[i + 2]; // B
  }

  const tensor = tf.tensor3d(float32Array, [128, 128, 3]).expandDims();
  // --- End of Preprocessing ---

  // Run the model prediction
  const result = model.predict(tensor) as tf.Tensor;
  const rawPredictions = await result.data() as Float32Array;

  // Process predictions using the corrected labels
  const processedPredictions = Array.from(rawPredictions)
    .map((confidence, index) => {
      // Use the label directly from the labels array
      const label = index < labels.length ? labels[index] : 'unknown';
      return {
        id: label,              // Unique identifier for the condition
        condition: label,       // Display name (matches Flutter's direct label use)
        confidence: confidence  // Raw confidence score
      };
    })
    .sort((a, b) => b.confidence - a.confidence);

  // Clean up tensors and resources
  tensor.dispose();
  result.dispose();
  URL.revokeObjectURL(imageElement.src);

  // Return top 3 predictions, matching Flutter's output style
  const finalPredictions: Prediction[] = processedPredictions.slice(0, 3).map(p => ({
    condition: p.condition,
    confidence: p.confidence,
    id: p.id
  }));

  return finalPredictions;
};