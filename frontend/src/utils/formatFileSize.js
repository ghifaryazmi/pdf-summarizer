/**
 * Formats a file size in bytes into a human-readable string.
 * Returns KB (no decimal, rounded) for files under 1 MB.
 * Returns MB with one decimal place for files 1 MB and above.
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size string
 */
export function formatFileSize(bytes) {
  const ONE_MB = 1024 * 1024;

  if (bytes < ONE_MB) {
    const kb = Math.round(bytes / 1024);
    return `${kb} KB`;
  }

  const mb = (bytes / ONE_MB).toFixed(1);
  return `${mb} MB`;
}
