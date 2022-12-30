import ImageCompressor from 'image-compressor';

export const compressorSettings = {
    toWidth : 100,
    toHeight : 100,
    mimeType : 'image/png',
    mode : 'strict',
    quality : 0.6,
    grayScale : true,
    sepia : true,
    threshold : 127,
    vReverse : true,
    hReverse : true,
    speed : 'low'
};

export const  compressImage = async(file: File, options: any): Promise<File> => {
  const compressedFile = await new ImageCompressor(file, options).compress();
  return compressedFile;
}