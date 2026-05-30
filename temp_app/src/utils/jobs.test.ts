import { describe, it, expect } from 'vitest';
import { resolveApplyTarget } from './jobs';

describe('resolveApplyTarget', () => {
  it('prefers an external apply link', () => {
    const t = resolveApplyTarget({ apply_link: 'https://forms.gle/abc', apply_email: 'r@co.com' });
    expect(t.type).toBe('link');
    if (t.type === 'link') expect(t.href).toBe('https://forms.gle/abc');
  });

  it('falls back to a mailto when there is no link', () => {
    const t = resolveApplyTarget({
      title: 'Frontend Engineer',
      company_name: 'Acme',
      apply_email: 'recruiter@acme.com',
    });
    expect(t.type).toBe('email');
    if (t.type === 'email') {
      expect(t.email).toBe('recruiter@acme.com');
      expect(t.mailto.startsWith('mailto:recruiter@acme.com?subject=')).toBe(true);
      expect(t.mailto).toContain('Frontend%20Engineer');
      expect(t.mailto).toContain('Acme');
    }
  });

  it('ignores whitespace-only values', () => {
    expect(resolveApplyTarget({ apply_link: '   ', apply_email: '  ' }).type).toBe('none');
  });

  it('returns none when nothing is provided', () => {
    expect(resolveApplyTarget({}).type).toBe('none');
  });
});
