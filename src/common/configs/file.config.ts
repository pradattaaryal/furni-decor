import { registerAs } from '@nestjs/config';
import bytes from 'bytes';

export default registerAs(
  'file',
  (): Record<string, any> => ({
    image: {
      maxFileSize: bytes(process.env.IMG_MAX_FILE_SIZE),
      maxFiles: Number(process.env.IMG_MAX_FILE),
    },
  }),
);
