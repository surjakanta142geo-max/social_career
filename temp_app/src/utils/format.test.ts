import { describe, it, expect } from 'vitest';
import { timeAgo, isRecent } from './format';

const NOW = new Date('2026-05-30T12:00:00Z').getTime();
const daysAgo = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();

describe('timeAgo', () => {
  it('returns "today" for the same day / future dates', () => {
    expect(timeAgo(daysAgo(0), NOW)).toBe('today');
    expect(timeAgo(new Date(NOW + 1000).toISOString(), NOW)).toBe('today');
  });

  it('handles singular and plural days', () => {
    expect(timeAgo(daysAgo(1), NOW)).toBe('1 day ago');
    expect(timeAgo(daysAgo(5), NOW)).toBe('5 days ago');
    expect(timeAgo(daysAgo(29), NOW)).toBe('29 days ago');
  });

  it('switches to months at 30 days', () => {
    expect(timeAgo(daysAgo(30), NOW)).toBe('1 month ago');
    expect(timeAgo(daysAgo(75), NOW)).toBe('2 months ago');
  });

  it('returns empty string for missing/invalid input', () => {
    expect(timeAgo('', NOW)).toBe('');
    expect(timeAgo('not-a-date', NOW)).toBe('');
  });
});

describe('isRecent', () => {
  it('is true within the window and false outside it', () => {
    expect(isRecent(daysAgo(2), 7, NOW)).toBe(true);
    expect(isRecent(daysAgo(8), 7, NOW)).toBe(false);
  });

  it('is false for missing/invalid input', () => {
    expect(isRecent('', 7, NOW)).toBe(false);
    expect(isRecent('nope', 7, NOW)).toBe(false);
  });
});
