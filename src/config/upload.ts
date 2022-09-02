import 'dotenv/config';
import crypto from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

const tmpFolderName = process.env.NODE_ENV === 'test' ? 'tmpTest' : 'tmp';

const tmpFolder = resolve(__dirname, '..', '..', tmpFolderName);

export default {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
