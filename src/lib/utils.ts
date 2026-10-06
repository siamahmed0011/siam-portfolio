export function getAssetUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return path;
  }
  if (path.startsWith("storage/")) {
    const sub = path.replace(/^storage\//, "");
    return `/uploads/${sub}`;
  }
  if (path.startsWith("projects/") || path.startsWith("achievements/") || path.startsWith("settings/") || path.startsWith("profile/")) {
    return `/uploads/${path}`;
  }
  if (path.startsWith("images/")) {
    return `/${path}`;
  }
  return `/${path}`;
}

export function formatDate(dateInput?: Date | string | null): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
