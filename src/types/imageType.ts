
export interface ImageType {
  path: string;
  url: string;
  imageId: string;
}
export interface ImageParams {
  file: File;
  folder: string;
  oldImagePath?: string;
}