# app.py

import io
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import tensorflow as tf

# ==============================================================================
# --- FINAL CONFIGURATION ---
# ==============================================================================
CLASS_NAMES = [
    "Acne And Rosacea Photos", "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions",
    "Atopic Dermatitis Photos", "Ba Cellulitis", "Ba Impetigo", "Bullous Disease Photos",
    "Cellulitis Impetigo And Other Bacterial Infections", "Eczema Photos", "Fu Athlete Foot",
    "Fu Nail Fungus", "Fu Ringworm", "Heathy", "Herpes Hpv And Other Stds Photos",
    "Lupus And Other Connective Tissue Diseases", "Poison Ivy Photos And Other Contact Dermatitis",
    "Psoriasis Pictures Lichen Planus And Related Diseases",
    "Scabies Lyme Disease And Other Infestations And Bites",
    "Seborrheic Keratoses And Other Benign Tumors",
    "Tinea Ringworm Candidiasis And Other Fungal Infections", "Urticaria Hives", "Vascular Tumors",
    "Vasculitis Photos", "Vi Chickenpox", "Vi Shingles", "Warts Molluscum And Other Viral Infections"
]
MODEL_FILENAME = "sk60.keras"
IMAGE_HEIGHT = 128
IMAGE_WIDTH = 128
# ==============================================================================

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join('models', MODEL_FILENAME)
model = None
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded. Check server startup logs.'}), 500
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading.'}), 400

    try:
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        
        image = image.resize((IMAGE_WIDTH, IMAGE_HEIGHT))
        
        # --- THIS IS THE FIX ---
        # We are no longer dividing by 255.0, to match the Flutter app's preprocessing.
        # The pixel values will now be in the range [0, 255].
        image_array = np.array(image) 
        # --- END OF FIX ---

        image_array = np.expand_dims(image_array, axis=0)
        
        predictions = model.predict(image_array)
        
        predicted_class_index = np.argmax(predictions[0])
        confidence_score = float(np.max(predictions[0]))
        class_name = CLASS_NAMES[predicted_class_index]

        return jsonify({
            'predictions': [{
                'class': class_name,
                'confidence': confidence_score
            }]
        })
    except Exception as e:
        print(f"❌ An unexpected error occurred during prediction: {e}")
        return jsonify({'error': 'Failed to process the image.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)