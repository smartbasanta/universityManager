import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  async upload(file: Express.Multer.File): Promise<string> {
    if (!file) return '';

    // ✅ Resolve to project root/uploads/
    const uploadsDir = path.resolve(__dirname, '..', '..', '..', 'uploads');

    // Ensure uploads/ directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename with extension
    const uniqueName =
      crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);

    const filePath = path.join(uploadsDir, uniqueName);

    // Write file to uploads/ directory
    await fs.writeFile(filePath, file.buffer);

    // Return relative URL for serving
    return `/uploads/${uniqueName}`;
  }
}
