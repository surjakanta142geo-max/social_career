import { describe, it, expect } from 'vitest';
import { buildJobsSearchParams, buildJobsHref } from './search';

describe('buildJobsSearchParams', () => {
  it('includes only non-empty trimmed fields', () => {
    expect(buildJobsSearchParams({ keyword: ' react ', location: '', experience: '1-3' }))
      .toBe('query=react&experience=1-3');
  });

  it('returns an empty string when nothing is provided', () => {
    expect(buildJobsSearchParams({})).toBe('');
    expect(buildJobsSearchParams({ keyword: '   ' })).toBe('');
  });

  it('encodes special characters', () => {
    expect(buildJobsSearchParams({ keyword: 'c++ dev', location: 'New Delhi' }))
      .toBe('query=c%2B%2B+dev&location=New+Delhi');
  });
});

describe('buildJobsHref', () => {
  it('builds a bare path when there is no query', () => {
    expect(buildJobsHref({})).toBe('/jobs');
  });

  it('appends the query string when present', () => {
    expect(buildJobsHref({ keyword: 'react' })).toBe('/jobs?query=react');
  });
});
