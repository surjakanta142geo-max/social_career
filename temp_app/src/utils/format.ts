/**
 * Human-readable relative time, e.g. "today", "3 days ago", "2 months ago".
 * `now` is injectable so it can be tested deterministically.
 */
export function timeAgo(dateStr: string, now: number = Date.now()): string {
  if (!dateStr) return '';
  const ts = new Date(dateStr).getTime();
  if (Number.isNaN(ts)) return '';

  const days = Math.floor((now - ts) / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

/** True when `dateStr` is within the last `withinDays` days (default 7). */
export function isRecent(dateStr: string, withinDays = 7, now: number = Date.now()): boolean {
  if (!dateStr) return false;
  const ts = new Date(dateStr).getTime();
  if (Number.isNaN(ts)) return false;
  return ts > now - withinDays * 24 * 60 * 60 * 1000;
}
