export type UploadResult = {
  url: string;
  key: string; // Cloudinary public_id in this case
};

export interface IAttachmentStorage {
  upload(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    folder?: string;
  }): Promise<UploadResult>;
}

export const IAttachmentStorage = Symbol('IAttachmentStorage');
