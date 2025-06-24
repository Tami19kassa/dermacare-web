const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
// Note: We are not using firebase-admin here to keep dependencies minimal.

// We can't load the model from a local file, so we will put the URL in an environment variable
const MODEL_URL = process.env.VITE_TFLITE_MODEL_URL;

let model; // Global model cache

async function loadModel() {
    if (!model) {
        console.log("Loading model from URL:", MODEL_URL);
        model = await tf.loadGraphModel(MODEL_URL);
        console.log("Model loaded successfully.");
    }
    return model;
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await loadModel();

        // The image is sent as a base64 string in the request body
        const { image: base64Image } = JSON.parse(event.body);

        if (!base64Image) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No image data provided.' }) };
        }
        
        // Convert base64 to a buffer
        const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
        
        // Pre-process the image
        const resizedBuffer = await sharp(buffer)
            .resize(128, 128)
            .toFormat('jpeg')
            .toBuffer();

        const tensor = tf.tidy(() => {
            return tf.node.decodeImage(resizedBuffer, 3).toFloat().div(255.0).expandDims();
        });

        // Make a prediction
        const prediction = model.predict(tensor);
        const probabilities = await prediction.data();

        tensor.dispose();
        prediction.dispose();
        
        // This is just a placeholder for your labels. You must ensure the order is correct.
        const labels = ["Acne", "Eczema", "Psoriasis", /* ... and so on ... */]; 
        
        const results = Array.from(probabilities).map((prob, i) => ({
            label: labels[i],
            confidence: prob,
        }));
        results.sort((a, b) => b.confidence - a.confidence);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                condition: results[0].label,
                confidence: results[0].confidence
            })
        };

    } catch (error) {
        console.error('Error during analysis:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyze image.' }),
        };
    }
};