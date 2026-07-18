import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp' as const
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    
    // Change file extension to .webp
    const filename = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    
    const compressedFile = new File([compressedBlob], filename, {
        type: 'image/webp',
        lastModified: Date.now()
    });
    
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}
