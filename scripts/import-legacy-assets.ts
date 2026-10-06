import fs from "fs";
import path from "path";

const SOURCE_ROOT = "E:/FullStack_dynamic_portfolio";
const TARGET_ROOT = "E:/portfolio";

async function copyFileSafe(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.warn(`Source file not found: ${src}`);
    return false;
  }
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
  return true;
}

async function copyDirectoryRecursive(srcDir: string, destDir: string) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Source dir not found: ${srcDir}`);
    return;
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

async function importLegacyAssets() {
  console.log("=== Starting Legacy Assets Migration (Read-Only Source) ===");

  // 1. Profile image
  const sourceProfile = path.join(SOURCE_ROOT, "public/images/profile.jpg");
  const targetProfile = path.join(TARGET_ROOT, "public/images/profile.jpg");
  await copyFileSafe(sourceProfile, targetProfile);

  // 2. Projects uploads (storage/app/public/projects)
  const sourceProjectsStorage = path.join(SOURCE_ROOT, "storage/app/public/projects");
  const targetProjectsUploads = path.join(TARGET_ROOT, "public/uploads/projects");
  await copyDirectoryRecursive(sourceProjectsStorage, targetProjectsUploads);

  // Also support root uploads alias if any images reference projects/ directly
  const targetProjectsDirect = path.join(TARGET_ROOT, "public/projects");
  await copyDirectoryRecursive(sourceProjectsStorage, targetProjectsDirect);

  // 3. Settings uploads (storage/app/public/settings if any)
  const sourceSettingsStorage = path.join(SOURCE_ROOT, "storage/app/public/settings");
  const targetSettingsUploads = path.join(TARGET_ROOT, "public/uploads/settings");
  if (fs.existsSync(sourceSettingsStorage)) {
    await copyDirectoryRecursive(sourceSettingsStorage, targetSettingsUploads);
  }

  // Ensure directories exist
  const dirsToEnsure = [
    path.join(TARGET_ROOT, "public/uploads/projects"),
    path.join(TARGET_ROOT, "public/uploads/achievements"),
    path.join(TARGET_ROOT, "public/uploads/settings"),
    path.join(TARGET_ROOT, "public/uploads/profile"),
    path.join(TARGET_ROOT, "public/images"),
  ];

  for (const dir of dirsToEnsure) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  console.log("=== Legacy Assets Migration Completed Successfully ===");
}

importLegacyAssets().catch((err) => {
  console.error("Asset migration failed:", err);
  process.exit(1);
});
