export const FILE_CONSTRAINTS = {
  audio: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: /audio\/(mpeg|wav|ogg|mp4|x-m4a|opus|webm)/,
    allowedExtensions: ['.mp3', '.wav', '.ogg', '.m4a', '.opus', '.webm']
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: /image\/(jpeg|png|webp)/,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
  }
} as const;
