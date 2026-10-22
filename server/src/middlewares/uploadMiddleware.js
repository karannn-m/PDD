import multer from 'multer';

// In-memory buffer storage for high-speed streaming to S3 and ML inference
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are allowed.`), false);
  }
};

export const leafUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Megabytes max
    files: 1
  },
  fileFilter
});

// Audio upload middleware for Voice AI
const audioFileFilter = (req, file, cb) => {
  const allowedAudioTypes = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/m4a'];
  if (allowedAudioTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid audio format: ${file.mimetype}. Supported: WAV, MP3, WebM, OGG.`), false);
  }
};

export const voiceUpload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 Megabytes max audio
  },
  fileFilter: audioFileFilter
});
