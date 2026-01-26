export interface UploadedFile {
  filepath: string;
  originalFilename?: string | null;
  mimetype?: string | null;
  size?: number;
}
