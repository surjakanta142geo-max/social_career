import { describe, it, expect, beforeEach, vi } from 'vitest';

const h = vi.hoisted(() => {
  const state = {
    profileResult: { data: { role: 'admin' } as any, error: null as any },
    selectResult: { data: [] as any, error: null as any },
    mutationResult: { data: null as any, error: null as any },
    queries: [] as any[],
    updated: [] as any[],
  };

  function makeQuery(table: string) {
    const calls = { eq: [] as Array<[string, any]>, updateArg: null as any };
    const q: any = {
      table,
      calls,
      select() { return q; },
      order() { return q; },
      eq(c: string, v: any) { calls.eq.push([c, v]); return q; },
      update(u: any) { calls.updateArg = u; state.updated.push({ table, updates: u, where: calls.eq }); return q; },
      single() { return Promise.resolve(state.profileResult); },
      then(resolve: any, reject: any) {
        const r = calls.updateArg !== null ? state.mutationResult : state.selectResult;
        return Promise.resolve(r).then(resolve, reject);
      },
    };
    state.queries.push(q);
    return q;
  }

  return { state, makeQuery };
});

vi.mock('@/utils/supabase/server', () => ({
  createClient: async () => ({
    from: (table: string) => h.makeQuery(table),
    auth: { getUser: async () => ({ data: { user: { id: 'admin-1', email: 'admin@x.com' } } }) },
  }),
}));
vi.mock('next/cache', () => ({ revalidatePath: () => {} }));
vi.mock('@/utils/bunny/storage', () => ({ uploadFile: async () => 'https://cdn/x.png' }));

import { getAllUsers, updateUserRole } from './userActions';

beforeEach(() => {
  h.state.profileResult = { data: { role: 'admin' }, error: null };
  h.state.selectResult = { data: [], error: null };
  h.state.mutationResult = { data: null, error: null };
  h.state.queries = [];
  h.state.updated = [];
});

describe('getAllUsers', () => {
  it('returns rows on success and [] on error', async () => {
    h.state.selectResult = { data: [{ id: 'a' }, { id: 'b' }], error: null };
    expect(await getAllUsers()).toHaveLength(2);

    h.state.selectResult = { data: null, error: { message: 'x' } };
    expect(await getAllUsers()).toEqual([]);
  });
});

describe('updateUserRole', () => {
  it('lets an admin change another user role', async () => {
    const res = await updateUserRole('user-2', 'recruiter');
    expect(res.success).toBe(true);
    expect(h.state.updated.at(-1).updates).toEqual({ role: 'recruiter' });
  });

  it('blocks non-admins', async () => {
    h.state.profileResult = { data: { role: 'recruiter' }, error: null };
    const res = await updateUserRole('user-2', 'admin');
    expect(res.error).toMatch(/admin/i);
    expect(h.state.updated).toHaveLength(0);
  });

  it('rejects invalid roles', async () => {
    const res = await updateUserRole('user-2', 'superuser');
    expect(res.error).toMatch(/invalid role/i);
  });

  it('prevents an admin from demoting themselves', async () => {
    const res = await updateUserRole('admin-1', 'job_seeker');
    expect(res.error).toMatch(/your own admin role/i);
    expect(h.state.updated).toHaveLength(0);
  });
});
