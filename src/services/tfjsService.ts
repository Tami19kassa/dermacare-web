 
import * as tf from '@tensorflow/tfjs';

export interface Prediction {
  id: string;
  condition: string;  
  confidence: number;  
}

const MODEL_URL = '/model/model.json';
const METADATA_URL = '/model/metadata.json';

 
let model: tf.LayersModel | null = null;
let metadata: { labels: string[] } | null = null;
 
let modelPromise: Promise<{ model: tf.LayersModel; metadata: any }> | null = null;

// --- Initialize the model and load metadata ---
export const initializeModel = (): Promise<{ model: tf.LayersModel; metadata: any }> => {
  if (modelPromise) {
    return modelPromise;
  }

  console.log('Initializing TensorFlow.js model...');

  modelPromise = new Promise(async (resolve, reject) => {
    try {
      // 1. Load the model topology and weights
      const loadedModel = await tf.loadLayersModel(MODEL_URL);
      model = loadedModel;

      // 2. Fetch and parse the metadata
      const metadataResponse = await fetch(METADATA_URL);
      const loadedMetadata = await metadataResponse.json();
      metadata = loadedMetadata;

      console.log('✅ TensorFlow.js model and metadata loaded successfully!');
      resolve({ model, metadata });
    } catch (err) {
      console.error('🔥 Failed to load TensorFlow.js model or metadata:', err);
      modelPromise = null; // Reset on failure
      reject(err);
    }
  });

  return modelPromise;
};

// --- Run prediction on an image file ---
export const runPrediction = async (imageFile: File): Promise<Prediction[]> => {
  // 1. Ensure the model is loaded before proceeding
  if (!model || !metadata) {
    throw new Error('Model not initialized. Call initializeModel() first.');
  }

  // 2. Create an HTMLImageElement from the file
  const imageElement = document.createElement('img');
  imageElement.src = URL.createObjectURL(imageFile);
  await new Promise((resolve, reject) => {
    imageElement.onload = resolve;
    imageElement.onerror = reject;
  });

  // 3. Pre-process the image into a tensor
  //    - Teachable Machine models are typically trained on 224x224 images.
  //    - Normalization scales pixel values from [0, 255] to [-1, 1].
  const imageTensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224]) // Resize the image
    .toFloat()
    .expandDims(0) // Add a batch dimension
    .div(127.5) // Normalize pixel values to [0, 2]
    .sub(1.0); // Normalize to [-1, 1]

  // 4. Run the prediction
  const predictions = model.predict(imageTensor) as tf.Tensor;
  const predictionData = await predictions.data(); // Get the raw probability array

  // 5. Clean up memory
  tf.dispose([imageTensor, predictions]);
  URL.revokeObjectURL(imageElement.src);

  // 6. Process the results
  const processedPredictions = Array.from(predictionData)
    .map((confidence, index) => ({
      confidence: confidence as number,
      condition: metadata!.labels[index], // Get class name from metadata
      id: metadata!.labels[index].toLowerCase().replace(/ /g, '_').replace(/[()]/g, ''),
    }))
    .sort((a, b) => b.confidence - a.confidence); // Sort by highest confidence

  return processedPredictions.slice(0, 3); // Return the top 3 results
};