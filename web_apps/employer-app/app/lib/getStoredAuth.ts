export default function getStoredAuth(): { [k: string]: any } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('onsite360_auth');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
