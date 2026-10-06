import fs from "fs";
import path from "path";
import crypto from "crypto";

export type UploadCategory = "projects" | "achievements" | "profile" | "settings";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface SaveFileOptions {
  category: UploadCategory;
  allowPdf?: boolean;
}

/**
 * Validates and saves an uploaded file to public/uploads/[category]
 * Returns the relative path for database storage (e.g. "projects/1727829102-a1b2c3d4.jpg")
 */
export async function saveUploadedFile(
  file: File,
  options: SaveFileOptions
): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("No file provided or file is empty");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isPdf = options.allowPdf && ALLOWED_DOC_TYPES.has(file.type);

  if (!isImage && !isPdf) {
    throw new Error(
      options.allowPdf
        ? "Invalid file type. Allowed types: JPEG, PNG, WEBP, GIF, SVG, or PDF"
        : "Invalid image type. Allowed types: JPEG, PNG, WEBP, GIF, SVG"
    );
  }

  // Derive safe extension
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

  // Generate safe random filename
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${randomSuffix}${ext}`;

  // Destination folder: public/uploads/[category]
  const uploadDir = path.join(process.cwd(), "public", "uploads", options.category);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const destinationPath = path.join(uploadDir, filename);

  // Prevent path traversal
  const resolvedPath = path.resolve(destinationPath);
  if (!resolvedPath.startsWith(uploadDir)) {
    throw new Error("Invalid destination path");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destinationPath, buffer);

  // Return stored relative path matching Laravel / public format: `${category}/${filename}`
  return `${options.category}/${filename}`;
}

/**
 * Safely deletes an uploaded file from disk if it exists inside public/uploads or public/projects
 */
export function deleteUploadedFile(filePath?: string | null): void {
  if (!filePath) return;

  // Clean relative path and sanitize
  const sanitized = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^storage(\/|\\)/, "").replace(/^public(\/|\\)/, "");
  
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
  const targetPath = path.join(publicUploadsDir, sanitized);

  try {
    if (fs.existsSync(targetPath)) {
      const resolved = path.resolve(targetPath);
      if (resolved.startsWith(publicUploadsDir)) {
        fs.unlinkSync(resolved);
      }
    }
  } catch {
    // Ignore file deletion errors gracefully
  }
}
