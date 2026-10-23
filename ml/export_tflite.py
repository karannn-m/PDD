"""
FloraScan - TFLite Edge Model Converter & Quantizer
======================================================
Converts trained Keras/H5 model to:
1. Standard Float32 TFLite (model.tflite)
2. Dynamic Range 8-bit Quantized TFLite (model_quant_dynamic.tflite)
3. Full INT8 Edge Quantized TFLite with representative dataset generator (model_quant_int8.tflite)
"""

import os
import argparse
import numpy as np
import tensorflow as tf

def representative_data_gen(sample_images_dir=None, num_samples=100):
    """
    Yields representative calibration inputs for INT8 post-training quantization.
    """
    if sample_images_dir and os.path.exists(sample_images_dir):
        import glob
        from PIL import Image
        image_paths = glob.glob(os.path.join(sample_images_dir, "*", "*.jpg"))[:num_samples]
        for img_path in image_paths:
            img = Image.open(img_path).convert('RGB').resize((224, 224))
            arr = np.array(img, dtype=np.float32) / 255.0
            arr = np.expand_dims(arr, axis=0)
            yield [arr]
    else:
        # Fallback synthetic calibration data
        for _ in range(num_samples):
            yield [np.random.uniform(0.0, 1.0, size=(1, 224, 224, 3)).astype(np.float32)]

def convert_to_tflite(model_path, output_dir="./models", sample_images_dir=None):
    os.makedirs(output_dir, exist_ok=True)
    print(f"📦 Loading trained Keras model from: {model_path}")
    model = tf.keras.models.load_model(model_path)

    # 1. Standard Float32 TFLite Conversion
    print("\n⚙️ Converting to standard Float32 TFLite...")
    converter_fp32 = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_fp32 = converter_fp32.convert()
    fp32_path = os.path.join(output_dir, "model.tflite")
    with open(fp32_path, "wb") as f:
        f.write(tflite_fp32)
    fp32_size_mb = os.path.getsize(fp32_path) / (1024 * 1024)
    print(f"✓ Float32 TFLite saved: {fp32_path} ({fp32_size_mb:.2f} MB)")

    # 2. Dynamic Range Quantization (Weight INT8, Activation Float32)
    print("\n⚙️ Converting with Dynamic Range Post-Training Quantization (PTQ)...")
    converter_dynamic = tf.lite.TFLiteConverter.from_keras_model(model)
    converter_dynamic.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_dynamic = converter_dynamic.convert()
    dynamic_path = os.path.join(output_dir, "model_quant_dynamic.tflite")
    with open(dynamic_path, "wb") as f:
        f.write(tflite_dynamic)
    dynamic_size_mb = os.path.getsize(dynamic_path) / (1024 * 1024)
    print(f"✓ Dynamic INT8 TFLite saved: {dynamic_path} ({dynamic_size_mb:.2f} MB)")

    # 3. Full INT8 Quantization (For Edge DSPs/NPUs)
    print("\n⚙️ Converting with Full INT8 Representative Quantization...")
    try:
        converter_int8 = tf.lite.TFLiteConverter.from_keras_model(model)
        converter_int8.optimizations = [tf.lite.Optimize.DEFAULT]
        converter_int8.representative_dataset = lambda: representative_data_gen(sample_images_dir)
        tflite_int8 = converter_int8.convert()
        int8_path = os.path.join(output_dir, "model_quant_int8.tflite")
        with open(int8_path, "wb") as f:
            f.write(tflite_int8)
        int8_size_mb = os.path.getsize(int8_path) / (1024 * 1024)
        print(f"✓ Full INT8 TFLite saved: {int8_path} ({int8_size_mb:.2f} MB)")
    except Exception as e:
        print(f"⚠️ Full INT8 quantization skipped: {e}")

    # 4. Verify TFLite Model with Interpreter
    verify_tflite_model(fp32_path)

def verify_tflite_model(tflite_path):
    print(f"\n🔍 Verifying TFLite model inference: {tflite_path}")
    interpreter = tf.lite.Interpreter(model_path=tflite_path)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    print(f"   Input shape: {input_details[0]['shape']}, dtype: {input_details[0]['dtype']}")
    print(f"   Output shape: {output_details[0]['shape']}, dtype: {output_details[0]['dtype']}")

    # Run dummy test inference
    test_input = np.random.uniform(0.0, 1.0, size=input_details[0]['shape']).astype(np.float32)
    interpreter.set_tensor(input_details[0]['index'], test_input)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])

    top_class = np.argmax(output_data[0])
    confidence = output_data[0][top_class]
    print(f"✓ Test inference successful: Predicted class {top_class} with confidence {confidence * 100:.2f}%")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export Keras Model to TFLite")
    parser.add_argument("--model_path", type=str, default="./models/plant_disease_model.keras",
                        help="Path to trained .keras or .h5 model")
    parser.add_argument("--output_dir", type=str, default="./models", help="Export target directory")
    parser.add_argument("--samples_dir", type=str, default=None, help="Directory containing sample images for calibration")
    args = parser.parse_args()

    # Fallback check for .h5 if .keras does not exist
    if not os.path.exists(args.model_path) and os.path.exists("./models/plant_disease_model.h5"):
        args.model_path = "./models/plant_disease_model.h5"

    convert_to_tflite(args.model_path, output_dir=args.output_dir, sample_images_dir=args.samples_dir)
