import { describe, it, expect, beforeEach, vi } from 'vitest';

// Shared, hoisted mock state so the vi.mock factories can reference it safely.
const h = vi.hoisted(() => {
  const state = {
    // result of `.single()` on the profiles table (role/email lookup)
    profileResult: { data: { role: 'recruiter', email: 'r@co.com' } as any, error: null as any },
    // result of `.single()` on the jobs table (getJobById)
    singleResult: { data: null as any, error: null as any },
    // result of an awaited SELECT builder (getJobs)
    selectResult: { data: [] as any, error: null as any },
    // result of an awaited mutation builder (insert/update/delete)
    mutationResult: { data: null as any, error: null as any },
    uploadShouldFail: false,
    queries: [] as any[],
    inserted: [] as any[],
    updated: [] as any[],
  };

  function makeQuery(table: string) {
    const calls = {
      select: [] as any[],
      order: [] as any[],
      or: [] as string[],
      eq: [] as Array<[string, any]>,
      insertArg: null as any,
      updateArg: null as any,
    };
    const q: any = {
      table,
      calls,
      select(arg: any) { calls.select.push(arg); return q; },
      order(col: string, opt: any) { calls.order.push([col, opt]); return q; },
      or(expr: string) { calls.or.push(expr); return q; },
      eq(col: string, val: any) { calls.eq.push([col, val]); return q; },
      insert(rows: any) { calls.insertArg = rows; state.inserted.push({ table, rows }); return q; },
      update(u: any) { calls.updateArg = u; state.updated.push({ table, updates: u }); return q; },
      delete() { return q; },
      single() {
        return Promise.resolve(table === 'profiles' ? state.profileResult : state.singleResult);
      },
      then(resolve: any, reject: any) {
        const isMutation = calls.insertArg !== null || calls.updateArg !== null;
        const r = isMutation ? state.mutationResult : state.selectResult;
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
    auth: {
      getUser: async () => ({ data: { user: { id: 'u1', email: 'me@example.com' } } }),
    },
  }),
}));

vi.mock('next/cache', () => ({ revalidatePath: () => {} }));
vi.mock('@/utils/bunny/storage', () => ({
  uploadFile: async () => {
    if (h.state.uploadShouldFail) throw new Error('bunny down');
    return 'https://cdn/logo.png';
  },
}));

import { getJobs, getJobById, createJob, editJob, reviewJob } from './jobActions';

function jobForm(overrides: Record<string, string> = {}, withLogo = false) {
  const fd = new FormData();
  const base: Record<string, string> = {
    title: 'Dev', company_name: 'Acme', state: 'Delhi', city: 'Delhi',
    job_type: 'full-time', work_mode: 'remote', salary: '', description: '',
    last_date: '', apply_link: '', apply_email: '', status: 'published',
  };
  Object.entries({ ...base, ...overrides }).forEach(([k, v]) => fd.set(k, v));
  if (withLogo) fd.set('logo', new File(['x'], 'logo.png', { type: 'image/png' }));
  return fd;
}

const lastInserted = () => h.state.inserted[h.state.inserted.length - 1].rows[0];

beforeEach(() => {
  h.state.profileResult = { data: { role: 'recruiter', email: 'r@co.com' }, error: null };
  h.state.singleResult = { data: null, error: null };
  h.state.selectResult = { data: [], error: null };
  h.state.mutationResult = { data: null, error: null };
  h.state.uploadShouldFail = false;
  h.state.queries = [];
  h.state.inserted = [];
  h.state.updated = [];
});

describe('getJobs', () => {
  it('translates keyword, location, type, mode and status into query calls', async () => {
    h.state.selectResult = { data: [{ id: '1' }], error: null };

    const data = await getJobs({
      query: 'react', location: 'Mumbai', job_type: 'full-time',
      work_mode: 'remote', status: 'published',
    });

    expect(data).toEqual([{ id: '1' }]);
    const q = h.state.queries[0];
    expect(q.calls.or).toContain('title.ilike.%react%,company_name.ilike.%react%');
    expect(q.calls.or).toContain('city.ilike.%Mumbai%,state.ilike.%Mumbai%');
    expect(q.calls.eq).toContainEqual(['job_type', 'full-time']);
    expect(q.calls.eq).toContainEqual(['work_mode', 'remote']);
    expect(q.calls.eq).toContainEqual(['status', 'published']);
  });

  it('returns an empty array when Supabase errors', async () => {
    h.state.selectResult = { data: null, error: { message: 'boom' } };
    expect(await getJobs({ query: 'x' })).toEqual([]);
  });
});

describe('getJobById', () => {
  it('returns the row on success and null on error', async () => {
    h.state.singleResult = { data: { id: 'abc' }, error: null };
    expect(await getJobById('abc')).toEqual({ id: 'abc' });

    h.state.singleResult = { data: null, error: { message: 'nf' } };
    expect(await getJobById('missing')).toBeNull();
  });
});

describe('createJob – review workflow', () => {
  it('routes a recruiter "publish" into the pending review queue', async () => {
    h.state.profileResult = { data: { role: 'recruiter', email: 'r@co.com' }, error: null };
    const res = await createJob(jobForm({ status: 'published' }));
    expect(res.success).toBe(true);
    expect(res.status).toBe('pending');
    expect(lastInserted().status).toBe('pending');
  });

  it('lets an admin publish directly', async () => {
    h.state.profileResult = { data: { role: 'admin', email: 'a@co.com' }, error: null };
    const res = await createJob(jobForm({ status: 'published' }));
    expect(res.status).toBe('published');
    expect(lastInserted().status).toBe('published');
  });

  it('keeps drafts as drafts', async () => {
    const res = await createJob(jobForm({ status: 'draft' }));
    expect(res.status).toBe('draft');
    expect(lastInserted().status).toBe('draft');
  });

  it('defaults apply_email to the creator email when omitted', async () => {
    await createJob(jobForm({ apply_email: '' }));
    expect(lastInserted().apply_email).toBe('r@co.com');
  });
});

describe('createJob – resilient logo upload', () => {
  it('still posts the job (with a warning) when the logo upload fails', async () => {
    h.state.uploadShouldFail = true;
    const res = await createJob(jobForm({}, true));
    expect(res.success).toBe(true);
    expect(res.warning).toMatch(/logo upload failed/i);
    expect(lastInserted().company_logo).toBeUndefined();
  });

  it('attaches the uploaded logo URL on success', async () => {
    const res = await createJob(jobForm({}, true));
    expect(res.warning).toBeUndefined();
    expect(lastInserted().company_logo).toBe('https://cdn/logo.png');
  });
});

describe('editJob', () => {
  it('updates fields and passes the chosen status through', async () => {
    const res = await editJob('j1', jobForm({ status: 'published', title: 'Updated Title' }));
    expect(res.success).toBe(true);
    const upd = h.state.updated.at(-1);
    expect(upd.table).toBe('jobs');
    expect(upd.updates.status).toBe('published');
    expect(upd.updates.title).toBe('Updated Title');
  });

  it('still saves with a warning when a new logo upload fails', async () => {
    h.state.uploadShouldFail = true;
    const res = await editJob('j1', jobForm({}, true));
    expect(res.success).toBe(true);
    expect(res.warning).toMatch(/logo upload failed/i);
  });
});

describe('reviewJob', () => {
  it('approves -> published (admin only)', async () => {
    h.state.profileResult = { data: { role: 'admin' }, error: null };
    const res = await reviewJob('j1', 'approve');
    expect(res.success).toBe(true);
    expect(res.status).toBe('published');
    expect(h.state.updated.at(-1)).toEqual({ table: 'jobs', updates: { status: 'published' } });
  });

  it('rejects -> rejected', async () => {
    h.state.profileResult = { data: { role: 'admin' }, error: null };
    const res = await reviewJob('j1', 'reject');
    expect(res.status).toBe('rejected');
  });

  it('blocks non-admins', async () => {
    h.state.profileResult = { data: { role: 'recruiter' }, error: null };
    const res = await reviewJob('j1', 'approve');
    expect(res.error).toMatch(/admin/i);
    expect(h.state.updated).toHaveLength(0);
  });
});
