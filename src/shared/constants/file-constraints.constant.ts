import { FileConstraints } from '@shared/types';

export const FILE_CONSTRAINTS = {
  audio: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: /audio\/(mpeg|wav|ogg|mp4|x-m4a|opus|webm)/,
    allowedExtensions: ['.mp3', '.wav', '.ogg', '.m4a', '.opus', '.webm']
  },
  image: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: /image\/(jpeg|png|webp)/,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
  }
} satisfies Record<string, FileConstraints>;
