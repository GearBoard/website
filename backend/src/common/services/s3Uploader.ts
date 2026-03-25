import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import type { Readable } from "stream";
import path from "path";

export interface S3UploadInput {
  file: Buffer | Readable | NodeJS.ReadableStream;
  filename: string;
  mimeType: string;
  size: number;
}

export interface S3UploadSuccess {
  url: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) return s3Client;

  const s3Region = process.env.S3_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!s3Region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing S3 credentials in environment variables");
  }

  s3Client = new S3Client({
    region: s3Region,
    credentials: { accessKeyId, secretAccessKey },
  });
  return s3Client;
}

/**
 * Uploads a file to AWS S3 and returns the file URL.
 * Throws an error if validation or upload fails.
 */
export async function uploadToS3(input: S3UploadInput): Promise<S3UploadSuccess> {
  const { file, filename, mimeType, size } = input;

  // Validation
  if (!file || size <= 0) {
    throw new Error("File must not be empty");
  }

  if (size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the 10MB limit");
  }

  let finalMimeType = mimeType;
  if (finalMimeType === "application/octet-stream" && filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext === ".png") finalMimeType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") finalMimeType = "image/jpeg";
  }

  if (!ALLOWED_MIME_TYPES.includes(finalMimeType)) {
    throw new Error(
      `Unsupported MIME type: ${finalMimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`
    );
  }

  // Configuration
  const s3BucketName = process.env.S3_BUCKET_NAME;
  const s3Region = process.env.S3_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!s3BucketName || !s3Region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing S3 credentials in environment variables");
  }

  const client = getS3Client();

  // Path generation
  const uuid = uuidv4();
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  // Safe filename
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `uploads/${year}/${month}/${uuid}-${sanitizedFilename}`;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: s3BucketName,
        Key: key,
        Body: file as Buffer | Uint8Array | string | Readable,
        ContentType: finalMimeType,
        ContentLength: size,
      })
    );

    // URL format: https://[bucket].s3.[region].amazonaws.com/[key]
    const url = `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${key}`;
    return { url };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
}
