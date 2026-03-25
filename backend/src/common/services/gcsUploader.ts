import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import type { Readable } from "stream";
import path from "path";

import { env } from "../../config/env.js";

export interface GCSUploadInput {
  file: Buffer | Readable | NodeJS.ReadableStream;
  filename: string;
  mimeType: string;
  size: number;
}

export interface GCSUploadSuccess {
  url: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

let gcsStorage: Storage | null = null;
let gcsBucket: ReturnType<Storage["bucket"]> | null = null;

function getGCSBucket() {
  if (gcsBucket) return gcsBucket;

  const bucketName = env.GCS_BUCKET_NAME;
  const projectId = env.GCS_PROJECT_ID;
  const keyFilename = env.GCS_KEY_FILE;

  if (!bucketName || !projectId || !keyFilename) {
    throw new Error("Missing GCS credentials in environment variables");
  }

  gcsStorage ??= new Storage({ projectId, keyFilename });
  gcsBucket = gcsStorage.bucket(bucketName);
  return gcsBucket;
}

export async function uploadToGCS(input: GCSUploadInput): Promise<GCSUploadSuccess> {
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

  // Path generation
  const uuid = uuidv4();
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  // Safe filename
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `uploads/${year}/${month}/${uuid}-${sanitizedFilename}`;

  const bucket = getGCSBucket();

  try {
    await bucket.file(key).save(file as Buffer, {
      contentType: finalMimeType,
      resumable: false,
      validation: false,
      metadata: {
        contentType: finalMimeType,
      },
    });

    const url = `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/${key}`;
    return { url };
  } catch (error) {
    console.error("GCS Upload Error:", error);
    throw new Error("Failed to upload file to GCS");
  }
}
