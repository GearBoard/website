import { uploadToGCS } from "../../../common/services/gcsUploader.js";
import { BadRequestError } from "../../../common/errors/app-error.js";
import { UploadImageOutputDTO } from "../dto/index.js";

export async function uploadImageService(file: File): Promise<UploadImageOutputDTO> {
  if (!file) {
    throw new BadRequestError("File is required");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await uploadToGCS({
    file: buffer,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  });

  return UploadImageOutputDTO.toDTO(result);
}
