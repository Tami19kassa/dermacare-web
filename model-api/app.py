 # app.py (TFLite Version)

import io
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
# Use the tflite_runtime interpreter instead of the full tensorflow
from tflite_runtime.interpreter import Interpreter

# ==============================================================================
# --- CONFIGURATION ---
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
MODEL_FILENAME = "model.tflite"  # <-- MAKE SURE THIS MATCHES YOUR TFLITE FILENAME
IMAGE_HEIGHT = 128
IMAGE_WIDTH = 128
# ==============================================================================

app = Flask(__name__)
# Configure CORS to allow all origins for the /predict endpoint
CORS(app, resources={r"/predict/*": {"origins": "*"}}) 

# --- Model Loading (TFLite specific) ---
MODEL_PATH = os.path.join('models', MODEL_FILENAME)
interpreter = None
try:
    # Load the TFLite model and allocate tensors
    interpreter = Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    print(f"✅ TFLite model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading TFLite model: {e}")

# --- API Endpoint Definition ---
@app.route('/predict', methods=['POST'])
def predict():
    if interpreter is None:
        return jsonify({'error': 'Model is not loaded. Check server logs.'}), 500
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading.'}), 400

    try:
        # Get input and output tensor details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        image = image.resize((IMAGE_WIDTH, IMAGE_HEIGHT))
        
        # Preprocess the image to match the model's input requirements
        # Note: We are NOT dividing by 255.0 to match your working Flutter app
        input_data = np.array(image, dtype=np.float32)
        input_data = np.expand_dims(input_data, axis=0)
        
        # Set the tensor to point to the input data to be inferred
        interpreter.set_tensor(input_details[0]['index'], input_data)
        
        # Run inference
        interpreter.invoke()
        
        # Extract the output data from the tensor
        output_data = interpreter.get_tensor(output_details[0]['index'])
        
        # Post-process the prediction
        predicted_class_index = np.argmax(output_data[0])
        # Note: TFLite models often output normalized values (0-1), 
        # so we don't need to apply softmax again.
        confidence_score = float(np.max(output_data[0]))
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

# Add a simple health check endpoint
@app.route('/healthz')
def healthz():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)