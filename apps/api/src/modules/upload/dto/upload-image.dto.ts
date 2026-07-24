import { z } from "zod";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const UploadImageBodyInputDTO = z.object({
  file: z
    .instanceof(File, { message: "File is required and must be a valid file" })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPEG and PNG images are allowed",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "File size exceeds the 10MB limit",
    }),
});

export class UploadImageOutputDTO {
  url!: string;

  static toDTO(result: { url: string }): UploadImageOutputDTO {
    return { url: result.url };
  }
}
