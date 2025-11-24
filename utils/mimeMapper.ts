export function getMimeType(resourceType: string, format: string): string {
  const map: Record<string, string> = {
    "image-jpg": "image/jpeg",
    "image-jpeg": "image/jpeg",
    "image-png": "image/png",
    "image-webp": "image/webp",
    "video-mp4": "video/mp4",
    "video-webm": "video/webm",
    "raw-pdf": "application/pdf",
    "raw-zip": "application/zip",
  };

  const key = `${resourceType}-${format}`.toLowerCase();
  return map[key] || `${resourceType}/${format}`;
}
