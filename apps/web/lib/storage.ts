import path from "path";
import fs from "fs/promises";
import { uploadToSpaces } from "./s3";

const isSpacesConfigured =
  process.env.DO_SPACES_KEY &&
  process.env.DO_SPACES_KEY !== "your-spaces-key" &&
  process.env.DO_SPACES_SECRET &&
  process.env.DO_SPACES_SECRET !== "your-spaces-secret";

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function storeFile(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (isSpacesConfigured) {
    return uploadToSpaces(buffer, fileName, contentType);
  }

  // Local fallback for development
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = path.join(LOCAL_UPLOAD_DIR, safeName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${safeName}`;
}
