export function getApiUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  // Always use same-origin relative path to prevent cross-origin cookie / CORS blocks
  return path.startsWith('/') ? path : `/${path}`;
}
