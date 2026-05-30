import { describe, it, expect, beforeEach, vi } from 'vitest';

// Shared, hoisted mock state so the vi.mock factory can reference it safely.
const h = vi.hoisted(() => {
  const state = {
    result: { data: [] as any, error: null as any },
    queries: [] as any[],
  };

  function makeQuery() {
    const calls = {
      select: [] as any[],
      order: [] as any[],
      or: [] as string[],
      eq: [] as Array<[string, any]>,
    };
    const q: any = {
      calls,
      select(arg: any) { calls.select.push(arg); return q; },
      order(col: string, opt: any) { calls.order.push([col, opt]); return q; },
      or(expr: string) { calls.or.push(expr); return q; },
      eq(col: string, val: any) { calls.eq.push([col, val]); return q; },
      single() { return Promise.resolve(state.result); },
      // make the builder awaitable
      then(resolve: any, reject: any) {
        return Promise.resolve(state.result).then(resolve, reject);
      },
    };
    state.queries.push(q);
    return q;
  }

  return { state, makeQuery };
});

vi.mock('@/utils/supabase/server', () => ({
  createClient: async () => ({
    from: () => h.makeQuery(),
    auth: {
      getUser: async () => ({ data: { user: { id: 'u1', email: 'me@example.com' } } }),
    },
  }),
}));

vi.mock('next/cache', () => ({ revalidatePath: () => {} }));
vi.mock('@/utils/bunny/storage', () => ({ uploadFile: async () => 'https://cdn/x.png' }));

import { getJobs, getJobById } from './jobActions';

beforeEach(() => {
  h.state.result = { data: [], error: null };
  h.state.queries = [];
});

describe('getJobs', () => {
  it('translates keyword, location, type, mode and status into query calls', async () => {
    h.state.result = { data: [{ id: '1' }], error: null };

    const data = await getJobs({
      query: 'react',
      location: 'Mumbai',
      job_type: 'full-time',
      work_mode: 'remote',
      status: 'published',
    });

    expect(data).toEqual([{ id: '1' }]);
    const q = h.state.queries[0];

    // keyword searches title OR company; location searches city OR state
    expect(q.calls.or).toContain('title.ilike.%react%,company_name.ilike.%react%');
    expect(q.calls.or).toContain('city.ilike.%Mumbai%,state.ilike.%Mumbai%');

    // exact-match filters
    expect(q.calls.eq).toContainEqual(['job_type', 'full-time']);
    expect(q.calls.eq).toContainEqual(['work_mode', 'remote']);
    expect(q.calls.eq).toContainEqual(['status', 'published']);
  });

  it('applies no filters when none are passed', async () => {
    await getJobs();
    const q = h.state.queries[0];
    expect(q.calls.or).toHaveLength(0);
    expect(q.calls.eq).toHaveLength(0);
  });

  it('returns an empty array when Supabase errors', async () => {
    h.state.result = { data: null, error: { message: 'boom' } };
    expect(await getJobs({ query: 'x' })).toEqual([]);
  });
});

describe('getJobById', () => {
  it('returns the row on success', async () => {
    h.state.result = { data: { id: 'abc', title: 'Dev' }, error: null };
    expect(await getJobById('abc')).toEqual({ id: 'abc', title: 'Dev' });
  });

  it('returns null when not found / on error', async () => {
    h.state.result = { data: null, error: { message: 'not found' } };
    expect(await getJobById('missing')).toBeNull();
  });
});
