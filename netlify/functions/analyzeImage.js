const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_URL = process.env.VITE_TFLITE_MODEL_URL;
const LABELS_URL = process.env.VITE_TFLITE_LABELS_URL;
let model;
let labels;

async function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const stream = fs.createWriteStream(filepath);
            res.pipe(stream);
            stream.on('finish', () => {
                stream.close();
                console.log(`Downloaded ${filepath}`);
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function loadModel() {
    if (model) return;
    try {
        // Functions run in a temporary directory
        const modelPath = '/tmp/skin_model.tflite';
        const labelsPath = '/tmp/skin_labels.txt';

        await Promise.all([
            downloadFile(MODEL_URL, modelPath),
            downloadFile(LABELS_URL, labelsPath)
        ]);

        model = await tf.loadGraphModel(`file://${modelPath}`);
        labels = fs.readFileSync(labelsPath, "utf-8").split("\n").map(l => l.trim());
        console.log("Model loaded successfully in Netlify Function.");
    } catch (e) {
        console.error("Failed to load model in Netlify Function:", e);
    }
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    await loadModel();
    if (!model) {
        return { statusCode: 500, body: JSON.stringify({ error: "Model not loaded" }) };
    }
    
    try {
        const { image: base64Image } = JSON.parse(event.body);
        const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
        
        const resized = await sharp(buffer).resize(128, 128).toFormat('jpeg').toBuffer();
        const tensor = tf.tidy(() => tf.node.decodeImage(resized, 3).toFloat().div(255).expandDims());
        
        const prediction = model.predict(tensor);
        const probabilities = await prediction.data();
        tensor.dispose();
        prediction.dispose();
        
        const results = Array.from(probabilities).map((p, i) => ({ label: labels[i], confidence: p }));
        results.sort((a, b) => b.confidence - a.confidence);
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ condition: results[0].label, confidence: results[0].confidence })
        };
    } catch (e) {
        console.error("Prediction error:", e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
};