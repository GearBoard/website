import "dotenv/config";

function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

function getEnvOptional(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  NODE_ENV: getEnvOptional("NODE_ENV", "development"),
  PORT: getEnvOptional("PORT", "4000"),
  DATABASE_URL: getEnv("DATABASE_URL"),

  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL"),
  BETTER_AUTH_TRUSTED_ORIGIN: getEnvOptional(
    "BETTER_AUTH_TRUSTED_ORIGIN",
    getEnv("BETTER_AUTH_URL")
  ),
  GOOGLE_CLIENT_ID: getEnvOptional("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnvOptional("GOOGLE_CLIENT_SECRET", ""),

  // AWS S3
  S3_REGION: getEnvOptional("S3_REGION", ""),
  AWS_ACCESS_KEY_ID: getEnvOptional("AWS_ACCESS_KEY_ID", ""),
  AWS_SECRET_ACCESS_KEY: getEnvOptional("AWS_SECRET_ACCESS_KEY", ""),
  S3_BUCKET_NAME: getEnvOptional("S3_BUCKET_NAME", ""),

  // GCS
  GCS_BUCKET_NAME: getEnvOptional("GCS_BUCKET_NAME", ""),
  GCS_PROJECT_ID: getEnvOptional("GCS_PROJECT_ID", ""),
  GCS_KEY_FILE: getEnvOptional("GCS_KEY_FILE", ""),
} as const;
