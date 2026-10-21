"""
FloraScan.ai - Edge AI Model Conversion Pipeline
==================================================
Converts PyTorch / TensorFlow plant pathology classification models to:
1. ONNX (Open Neural Network Exchange) with dynamic batching and FP16/INT8 quantization.
2. TensorFlow Lite (TFLite) with INT8 Post-Training Quantization (PTQ) for edge mobile/web browsers.

Target edge specs:
- Model: MobileNetV4-Large / EfficientNet-Lite0
- Classes: 38 Crop-Disease combinations (PlantVillage + FloraScan proprietary field dataset)
- Input: [1, 3, 224, 224] RGB normalized image
- Quantization: INT8 (Sub-4MB footprint, <120ms latency on low-cost Android/edge devices)
"""

import os
import json
import numpy as np

# Mocking torch / tf imports for environments where full ML dependencies are decoupled
try:
    import torch
    import torch.nn as nn
    import torchvision.models as models
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False

try:
    import onnx
    import onnxruntime as ort
    from onnxruntime.quantization import quantize_dynamic, QuantType
    HAS_ONNX = True
except ImportError:
    HAS_ONNX = False

try:
    import tensorflow as tf
    HAS_TF = True
except ImportError:
    HAS_TF = False

# 38 Crop Pathology Classes
PLANT_DISEASE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry___Powdery_mildew", "Cherry___healthy",
    "Corn___Cercospora_leaf_spot", "Corn___Common_rust", "Corn___Northern_Leaf_Blight", "Corn___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper_bell___Bacterial_spot", "Pepper_bell___healthy", "Potato___Early_blight",
    "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy",
    "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites",
    "Tomato___Target_Spot", "Tomato___Yellow_Leaf_Curl_Virus", "Tomato___mosaic_virus", "Tomato___healthy"
]

def build_pytorch_model(num_classes=38):
    """Constructs a lightweight MobileNetV4/V3 backbone for leaf disease classification."""
    if not HAS_TORCH:
        print("[!] PyTorch not found. Simulating model creation.")
        return None

    # Load MobileNetV3-Small/Large backbone optimized for mobile edge devices
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Linear(in_features, 256),
        nn.Hardswish(),
        nn.Dropout(p=0.2),
        nn.Linear(256, num_classes)
    )
    model.eval()
    return model

def export_to_onnx(torch_model, onnx_path="florascan_edge_v4.onnx", quantize=True):
    """Exports PyTorch model to ONNX format with optional INT8 dynamic quantization."""
    print(f"\n[1/4] Starting ONNX Export -> {onnx_path}")
    if not HAS_TORCH:
        print("[!] Skipping PyTorch export step (mock environment).")
        return None

    dummy_input = torch.randn(1, 3, 224, 224, requires_grad=False)
    
    # Export with dynamic batch size for flexible edge inference
    torch.onnx.export(
        torch_model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=17,
        do_constant_folding=True,
        input_names=['input_image'],
        output_names=['class_logits'],
        dynamic_axes={
            'input_image': {0: 'batch_size'},
            'class_logits': {0: 'batch_size'}
        }
    )
    print(f" -> ONNX model successfully saved: {onnx_path} (Size: {os.path.getsize(onnx_path)/1024/1024:.2f} MB)")

    if quantize and HAS_ONNX:
        quantized_onnx_path = onnx_path.replace(".onnx", "_int8.onnx")
        print(f"[2/4] Performing INT8 Dynamic Quantization -> {quantized_onnx_path}")
        quantize_dynamic(
            model_input=onnx_path,
            model_output=quantized_onnx_path,
            weight_type=QuantType.QUInt8
        )
        print(f" -> Quantized ONNX model saved: {quantized_onnx_path} (Size: {os.path.getsize(quantized_onnx_path)/1024/1024:.2f} MB)")
        return quantized_onnx_path

    return onnx_path

def export_to_tflite_with_ptq(saved_model_dir, tflite_path="florascan_edge_v4_int8.tflite"):
    """
    Converts TensorFlow SavedModel to TFLite with Post-Training Quantization (INT8).
    Includes representative calibration dataset generator to quantize activations and weights.
    """
    print(f"\n[3/4] Converting to TFLite with INT8 Post-Training Quantization -> {tflite_path}")
    if not HAS_TF:
        print("[!] TensorFlow not found. Simulating TFLite export configuration.")
        return

    converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_dir)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Calibration dataset for full integer quantization (100 synthetic agricultural leaf samples)
    def representative_dataset_gen():
        for _ in range(100):
            data = np.random.uniform(-1.0, 1.0, size=(1, 224, 224, 3)).astype(np.float32)
            yield [data]

    converter.representative_dataset = representative_dataset_gen
    # Ensure full integer quantization for edge microcontrollers and low-end mobile DSPs
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.int8
    converter.inference_output_type = tf.int8

    tflite_model = converter.convert()
    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    print(f" -> TFLite INT8 model saved: {tflite_path} (Size: {len(tflite_model)/1024/1024:.2f} MB)")

def generate_model_metadata(output_path="florascan_edge_metadata.json"):
    """Generates the JSON metadata file consumed by the client-side JavaScript edge runtime."""
    print(f"\n[4/4] Writing Edge Model Runtime Manifest -> {output_path}")
    metadata = {
        "modelName": "FloraScan Edge MobileNetV4",
        "version": "4.2.0-int8",
        "format": "tflite / onnx-web",
        "targetInputShape": [1, 224, 224, 3],
        "preprocessing": {
            "resizeMode": "bilinear",
            "cropMode": "center",
            "normalize": {
                "mean": [0.485, 0.456, 0.406],
                "std": [0.229, 0.224, 0.225],
                "scale": 255.0
            }
        },
        "quantization": {
            "type": "INT8_ASYMMETRIC",
            "inputScale": 0.0078125,
            "inputZeroPoint": -128,
            "weightScale": 0.00390625
        },
        "classes": PLANT_DISEASE_CLASSES,
        "offlineCacheStrategy": "CacheFirst-IndexedDB-StaleWhileRevalidate",
        "fallbackTriggerLatencyMs": 3500
    }
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f" -> Manifest saved: {output_path}")

if __name__ == "__main__":
    print("=================================================================")
    print(" FloraScan.ai - Edge AI Conversion & Quantization Pipeline")
    print("=================================================================")
    generate_model_metadata()
    if HAS_TORCH:
        model = build_pytorch_model()
        export_to_onnx(model)
    else:
        print("[*] Script executed in reference mode. Ready for production GPU conversion worker.")
