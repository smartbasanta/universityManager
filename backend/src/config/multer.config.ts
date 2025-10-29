import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * A factory function to create Multer options for file uploads.
 * @param subfolder The subfolder within './uploads' to save files to.
 */
export const multerOptionsFactory = (subfolder: string): MulterOptions => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `./uploads/${subfolder}`;
      // Ensure the upload path exists.
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${subfolder}-${uniqueSuffix}${ext}`);
    },
  }),

  fileFilter: (req: any, file: Express.Multer.File, cb: Function) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
      return cb(
        new HttpException('Only image files (jpeg, png, jpg, webp) are allowed!', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    cb(null, true);
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // Max file size: 2MB
  },
});

// You can now create specific options by calling the factory
export const profilePhotoStorage = multerOptionsFactory('profile-photos');
export const researchNewsPhotoStorage = multerOptionsFactory('research-news');
export const universityLogoStorage = multerOptionsFactory('university-logos');