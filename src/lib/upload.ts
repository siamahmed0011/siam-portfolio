import path from "path";
import crypto from "crypto";
import { put, del } from "@vercel/blob";

export type UploadCategory = "projects" | "achievements" | "profile" | "settings" | "documents";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);

// 4.5MB safe limit for Vercel Serverless Functions request body
export const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

export interface SaveFileOptions {
  category: UploadCategory;
  allowPdf?: boolean;
  slug?: string;
}

/**
 * Returns true if the given URL is a Vercel Blob storage URL
 */
export function isVercelBlobUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return (
    url.startsWith("https://") &&
    (url.includes(".blob.vercel-storage.com") || url.includes("public.blob.vercel-storage.com") || url.includes("vercel-storage.com"))
  );
}

/**
 * Generates a clean URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "file";
}

/**
 * Derives a clean file extension based on file name or MIME type
 */
function getSafeExtension(file: File): string {
  let ext = path.extname(file.name).toLowerCase();
  if (!ext || ext.length > 5) {
    if (file.type === "image/jpeg") ext = ".jpg";
    else if (file.type === "image/png") ext = ".png";
    else if (file.type === "image/webp") ext = ".webp";
    else if (file.type === "image/gif") ext = ".gif";
    else if (file.type === "image/svg+xml") ext = ".svg";
    else if (file.type === "application/pdf") ext = ".pdf";
    else ext = ".bin";
  }
  return ext;
}

/**
 * Validates and saves an uploaded file using Vercel Blob (or local development fallback).
 * Returns the public URL (e.g. "https://...public.blob.vercel-storage.com/...") or relative path.
 */
export async function saveUploadedFile(
  file: File,
  options: SaveFileOptions
): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("No file provided or file is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size limit of ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)}MB.`);
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isPdf = options.allowPdf && ALLOWED_DOC_TYPES.has(file.type);

  if (!isImage && !isPdf) {
    throw new Error(
      options.allowPdf
        ? "Invalid file type. Allowed types: JPG, PNG, WEBP, GIF, SVG, or PDF."
        : "Invalid image type. Allowed types: JPG, PNG, WEBP, GIF, SVG."
    );
  }

  const ext = getSafeExtension(file);
  const safeSlug = options.slug ? slugify(options.slug) : "upload";
  const timestamp = Date.now();
  const folder = options.category === "settings" && isPdf ? "documents" : options.category;
  const pathname = `${folder}/${safeSlug}-${timestamp}${ext}`;

  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  // When Blob credentials are present or running in production, use @vercel/blob
  if (hasBlobToken || isProduction) {
    try {
      const blob = await put(pathname, file, {
        access: "public",
        contentType: file.type || undefined,
        addRandomSuffix: false,
      });

      return blob.url;
    } catch (err: unknown) {
      console.error("Vercel Blob upload failed:", err);
      throw new Error("Unable to upload file to storage. Please check storage configuration and try again.");
    }
  }

  // Local development fallback only (never executed in production/Vercel)
  try {
    const fs = await import("fs");
    const uploadDir = path.join(process.cwd(), "public", "uploads", options.category);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const localFilename = `${safeSlug}-${timestamp}-${randomSuffix}${ext}`;
    const destinationPath = path.join(uploadDir, localFilename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    return `${options.category}/${localFilename}`;
  } catch (err: unknown) {
    console.error("Local file save failed:", err);
    throw new Error("Unable to save file locally in development.");
  }
}

/**
 * Safely deletes an uploaded file.
 * If the file is a Vercel Blob URL, it deletes it from Vercel Blob store.
 * If it is a local dev file, it cleans it up in local dev only.
 * Legacy static files and production filesystem are never unlinked.
 */
export async function deleteUploadedFile(filePathOrUrl?: string | null): Promise<void> {
  if (!filePathOrUrl) return;

  // 1. Vercel Blob URL deletion
  if (isVercelBlobUrl(filePathOrUrl)) {
    try {
      await del(filePathOrUrl);
    } catch (err: unknown) {
      console.warn("Failed to delete Vercel Blob file:", err);
    }
    return;
  }

  // 2. Production filesystem protection: never unlink /var/task/public/...
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  if (isProduction) {
    return;
  }

  // 3. Local development cleanup
  try {
    const fs = await import("fs");
    const sanitized = path
      .normalize(filePathOrUrl)
      .replace(/^(\.\.(\/|\\|$))+/, "")
      .replace(/^storage(\/|\\)/, "")
      .replace(/^public(\/|\\)/, "");

    const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
    const targetPath = path.join(publicUploadsDir, sanitized);

    if (fs.existsSync(targetPath)) {
      const resolved = path.resolve(targetPath);
      if (resolved.startsWith(publicUploadsDir)) {
        fs.unlinkSync(resolved);
      }
    }
  } catch {
    // Ignore local cleanup errors gracefully
  }
}
