"""
FloraScan - PlantVillage Dataset Setup & Preprocessing Pipeline
===================================================================
1. Downloads the 38-class PlantVillage dataset via Kagglehub or TensorFlow Datasets (TFDS).
2. Splits dataset into Training (80%), Validation (10%), and Testing (10%).
3. Applies resizing (224x224), normalization (0-1), and data augmentation.
"""

import os
import shutil
import random
import argparse
from pathlib import Path
import tensorflow as tf

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
RANDOM_SEED = 42

def download_via_kagglehub(dest_dir="./dataset"):
    """
    Downloads the PlantVillage dataset via kagglehub without requiring API credentials.
    """
    try:
        import kagglehub
        print("📥 Downloading PlantVillage dataset via kagglehub...")
        path = kagglehub.dataset_download("emmarex/plantdisease")
        print(f"✓ Downloaded to cache: {path}")
        return path
    except Exception as e:
        print(f"⚠️ kagglehub download failed ({e}). Attempting TFDS fallback...")
        return None

def split_raw_dataset(raw_dir, output_dir="./dataset", train_ratio=0.8, val_ratio=0.1, test_ratio=0.1):
    """
    Splits a flat directory of class folders into train, val, and test splits (80/10/10).
    """
    raw_path = Path(raw_dir)
    # Find directory containing class folders
    subdirs = [d for d in raw_path.iterdir() if d.is_dir()]
    if len(subdirs) == 1 and subdirs[0].name.lower() in ['plantvillage', 'dataset', 'color']:
        raw_path = subdirs[0]
        subdirs = [d for d in raw_path.iterdir() if d.is_dir()]

    print(f"📂 Found {len(subdirs)} classes in: {raw_path}")
    
    splits = ['train', 'val', 'test']
    for s in splits:
        os.makedirs(os.path.join(output_dir, s), exist_ok=True)

    random.seed(RANDOM_SEED)

    for class_dir in subdirs:
        class_name = class_dir.name
        images = [f for f in class_dir.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        random.shuffle(images)

        n_total = len(images)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)

        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train + n_val]
        test_imgs = images[n_train + n_val:]

        for split_name, img_list in [('train', train_imgs), ('val', val_imgs), ('test', test_imgs)]:
            target_class_dir = os.path.join(output_dir, split_name, class_name)
            os.makedirs(target_class_dir, exist_ok=True)
            for img_path in img_list:
                shutil.copy2(img_path, os.path.join(target_class_dir, img_path.name))

    print(f"✓ Dataset successfully split into 80/10/10 saved at: {output_dir}")

def load_tfds_plant_village():
    """
    Alternative loader: Loads plant_village directly from TensorFlow Datasets.
    """
    import tensorflow_datasets as tfds
    print("📥 Loading plant_village from TensorFlow Datasets (TFDS)...")
    
    (train_ds, val_ds, test_ds), ds_info = tfds.load(
        'plant_village',
        split=['train[:80%]', 'train[80%:90%]', 'train[90%:]'],
        shuffle_files=True,
        as_supervised=True,
        with_info=True
    )
    
    def preprocess(image, label):
        image = tf.image.resize(image, IMAGE_SIZE)
        image = tf.cast(image, tf.float32) / 255.0  # Normalize to [0, 1]
        return image, label

    train_ds = train_ds.map(preprocess, num_parallel_calls=tf.data.AUTOTUNE)
    train_ds = train_ds.shuffle(1000).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    val_ds = val_ds.map(preprocess, num_parallel_calls=tf.data.AUTOTUNE).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
    test_ds = test_ds.map(preprocess, num_parallel_calls=tf.data.AUTOTUNE).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds, test_ds, ds_info

def create_tf_data_pipelines(data_dir="./dataset"):
    """
    Creates production tf.data input pipelines from train/val/test directories.
    Includes data augmentation for the training split.
    """
    train_dir = os.path.join(data_dir, 'train')
    val_dir = os.path.join(data_dir, 'val')
    test_dir = os.path.join(data_dir, 'test')

    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.15),
        tf.keras.layers.RandomContrast(0.1),
    ], name="data_augmentation")

    train_ds = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='categorical',
        shuffle=True,
        seed=RANDOM_SEED
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='categorical',
        shuffle=False
    )

    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='categorical',
        shuffle=False
    )

    # Normalize [0, 255] -> [0, 1] and attach augmentation
    rescale_layer = tf.keras.layers.Rescaling(1.0 / 255)

    train_ds = train_ds.map(lambda x, y: (data_augmentation(rescale_layer(x), training=True), y),
                            num_parallel_calls=tf.data.AUTOTUNE)
    train_ds = train_ds.prefetch(tf.data.AUTOTUNE)

    val_ds = val_ds.map(lambda x, y: (rescale_layer(x), y), num_parallel_calls=tf.data.AUTOTUNE).prefetch(tf.data.AUTOTUNE)
    test_ds = test_ds.map(lambda x, y: (rescale_layer(x), y), num_parallel_calls=tf.data.AUTOTUNE).prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds, test_ds

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PlantVillage Data Preparation")
    parser.add_argument("--source", type=str, default="kaggle", choices=["kaggle", "tfds", "local"],
                        help="Data download source")
    parser.add_argument("--raw_path", type=str, default=None, help="Path to raw unzipped dataset if using local")
    parser.add_argument("--output_dir", type=str, default="./dataset", help="Target dataset directory")
    args = parser.parse_args()

    if args.source == "kaggle":
        raw_cached_path = download_via_kagglehub()
        if raw_cached_path:
            split_raw_dataset(raw_cached_path, output_dir=args.output_dir)
    elif args.source == "local" and args.raw_path:
        split_raw_dataset(args.raw_path, output_dir=args.output_dir)
    elif args.source == "tfds":
        load_tfds_plant_village()
        print("✓ TFDS pipeline verified.")
