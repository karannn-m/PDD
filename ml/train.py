"""
FloraScan.ai - PlantVillage Transfer Learning Model Training
=============================================================
Architecture: MobileNetV2 / EfficientNetB0 base + Custom Classification Head
Callbacks: EarlyStopping, ModelCheckpoint (Best Validation Accuracy), ReduceLROnPlateau
Output: plant_disease_model.keras, plant_disease_model.h5, and class_indices.json
"""

import os
import json
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from data_setup import create_tf_data_pipelines, IMAGE_SIZE

NUM_CLASSES = 38
EPOCHS_PHASE_1 = 10
EPOCHS_PHASE_2 = 15

def build_transfer_learning_model(base_architecture='mobilenet_v2', input_shape=(224, 224, 3), num_classes=38):
    """
    Builds transfer learning neural network with pre-trained ImageNet backbone.
    """
    if base_architecture.lower() == 'mobilenet_v2':
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=input_shape,
            include_top=False,
            weights='imagenet'
        )
    elif base_architecture.lower() == 'efficientnet_b0':
        base_model = tf.keras.applications.EfficientNetB0(
            input_shape=input_shape,
            include_top=False,
            weights='imagenet'
        )
    else:
        raise ValueError(f"Unsupported backbone: {base_architecture}")

    # Freeze backbone weights initially
    base_model.trainable = False

    inputs = tf.keras.Input(shape=input_shape, name="input_leaf_image")
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.BatchNormalization(name="batch_norm")(x)
    x = layers.Dense(256, activation='relu', name="dense_features")(x)
    x = layers.Dropout(0.3, name="dropout")(x)
    outputs = layers.Dense(num_classes, activation='softmax', name="disease_classification")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name=f"FloraScan_{base_architecture.upper()}")
    return model, base_model

def train_pipeline(data_dir="./dataset", base_arch='mobilenet_v2', output_dir="./models"):
    os.makedirs(output_dir, exist_ok=True)

    print("📊 Loading TF dataset pipelines with 80/10/10 split...")
    train_ds, val_ds, test_ds = create_tf_data_pipelines(data_dir)

    # Save class indices
    train_raw = tf.keras.utils.image_dataset_from_directory(
        os.path.join(data_dir, 'train'),
        image_size=IMAGE_SIZE,
        batch_size=32,
        label_mode='categorical',
        shuffle=False
    )
    class_names = train_raw.class_names
    class_indices_path = os.path.join(output_dir, "class_indices.json")
    with open(class_indices_path, "w") as f:
        json.dump({i: name for i, name in enumerate(class_names)}, f, indent=2)
    print(f"✓ Saved {len(class_names)} class indices to {class_indices_path}")

    # Build Model
    model, base_model = build_transfer_learning_model(
        base_architecture=base_arch,
        num_classes=len(class_names)
    )
    model.summary()

    # Phase 1: Train Custom Classification Head
    print("\n--- PHASE 1: Training Classification Head (Backbone Frozen) ---")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
    )

    best_model_path = os.path.join(output_dir, "plant_disease_model.keras")
    checkpoint_cb = callbacks.ModelCheckpoint(
        filepath=best_model_path,
        monitor='val_accuracy',
        mode='max',
        save_best_only=True,
        verbose=1
    )
    early_stopping_cb = callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    reduce_lr_cb = callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=3,
        min_lr=1e-6,
        verbose=1
    )

    history_p1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_PHASE_1,
        callbacks=[checkpoint_cb, early_stopping_cb, reduce_lr_cb]
    )

    # Phase 2: Fine-Tuning Top Layers of Backbone
    print("\n--- PHASE 2: Fine-Tuning Backbone Layers ---")
    base_model.trainable = True
    # Freeze initial layers, fine-tune the last 30 layers
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
    )

    history_p2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_PHASE_2,
        callbacks=[checkpoint_cb, early_stopping_cb, reduce_lr_cb]
    )

    # Save final model in legacy H5 format as well
    h5_path = os.path.join(output_dir, "plant_disease_model.h5")
    model.save(h5_path)
    print(f"✓ Model successfully saved to: {best_model_path} and {h5_path}")

    # Evaluate on Unseen Test Dataset
    print("\n--- EVALUATION ON TEST DATASET (10% Split) ---")
    test_metrics = model.evaluate(test_ds, verbose=1)
    print(f"Test Loss: {test_metrics[0]:.4f}")
    print(f"Test Accuracy: {test_metrics[1] * 100:.2f}%")
    print(f"Test Top-3 Accuracy: {test_metrics[2] * 100:.2f}%")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FloraScan PlantVillage Model Training")
    parser.add_argument("--data_dir", type=str, default="./dataset", help="Path to 80/10/10 split dataset")
    parser.add_argument("--backbone", type=str, default="mobilenet_v2", choices=["mobilenet_v2", "efficientnet_b0"])
    parser.add_argument("--output_dir", type=str, default="./models", help="Directory to save trained model")
    args = parser.parse_args()

    train_pipeline(data_dir=args.data_dir, base_arch=args.backbone, output_dir=args.output_dir)
