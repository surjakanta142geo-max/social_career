import { describe, it, expect } from 'vitest';
import { normalizeBunnyPublicUrl } from './url';

describe('normalizeBunnyPublicUrl', () => {
  it('adds https:// when the pull zone has no protocol', () => {
    expect(normalizeBunnyPublicUrl('social-career.b-cdn.net', 'avatars', 'a.png'))
      .toBe('https://social-career.b-cdn.net/avatars/a.png');
  });

  it('keeps an existing protocol', () => {
    expect(normalizeBunnyPublicUrl('http://cdn.example.com', 'job-logos', 'l.png'))
      .toBe('http://cdn.example.com/job-logos/l.png');
  });

  it('strips trailing slashes on the pull zone and path', () => {
    expect(normalizeBunnyPublicUrl('https://cdn.example.com/', '/blog-thumbnails/', 't.png'))
      .toBe('https://cdn.example.com/blog-thumbnails/t.png');
  });
});
