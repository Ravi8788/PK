import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: 'Cloudinary is not configured' });
  }

  const folder = req.body.folder || 'pk-graphics';
  const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
