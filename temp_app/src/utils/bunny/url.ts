/**
 * Build the public (pull-zone) URL for an uploaded file.
 * Ensures the pull zone has an https protocol and no trailing slash, so the
 * browser never treats "social-career.b-cdn.net/.." as a relative path.
 */
export function normalizeBunnyPublicUrl(pullZoneUrl: string, path: string, filename: string): string {
  let clean = pullZoneUrl.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return `${clean}/${cleanPath}/${filename}`;
}
