'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadFile } from '@/utils/bunny/storage'

export async function createJob(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const company_name = formData.get('company_name') as string
  const state = formData.get('state') as string
  const city = formData.get('city') as string
  const job_type = formData.get('job_type') as string
  const work_mode = formData.get('work_mode') as string
  const salary = formData.get('salary') as string
  const description = formData.get('description') as string
  const last_date = formData.get('last_date') as string
  const apply_link = (formData.get('apply_link') as string)?.trim() || null
  let apply_email = (formData.get('apply_email') as string)?.trim() || null
  const requestedStatus = (formData.get('status') as string) || 'published'

  // Look up the creator's role + email (single round-trip).
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  // If no contact email is provided, fall back to the creator's account email
  // so candidates can always reach the recruiter when there is no apply link.
  if (!apply_email) {
    apply_email = profile?.email ?? user.email ?? null
  }

  // Moderation: drafts stay drafts; a "published" request from a recruiter goes
  // into the admin review queue ("pending"). Admins publish directly.
  let status = requestedStatus
  if (requestedStatus === 'published' && profile?.role !== 'admin') {
    status = 'pending'
  }

  // Upload company logo to Bunny CDN (if provided). This must NOT block the
  // job from being posted — if the upload fails, save the job without a logo.
  let company_logo: string | undefined
  let warning: string | undefined
  const logo = formData.get('logo') as File | null
  if (logo && logo.size > 0) {
    try {
      company_logo = await uploadFile(logo, 'job-logos')
    } catch (e: any) {
      warning = `Job posted, but the logo upload failed (${e.message}). You can add a logo later by editing the job.`
    }
  }

  const { error } = await supabase.from('jobs').insert([
    {
      title,
      company_name,
      company_logo,
      state,
      city,
      job_type,
      work_mode,
      salary,
      description,
      last_date,
      apply_link,
      apply_email,
      status,
      created_by: user.id
    }
  ])

  if (error) return { error: error.message }
  revalidatePath('/jobs')
  revalidatePath('/admin')
  return { success: true, status, warning }
}

/** Admin moderation: approve or reject a job that is awaiting review. */
export async function reviewJob(id: string, decision: 'approve' | 'reject') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { error: 'Only admins can review jobs' }

  const status = decision === 'approve' ? 'published' : 'rejected'
  const { error } = await supabase.from('jobs').update({ status }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/jobs')
  revalidatePath('/admin')
  return { success: true, status }
}

/** Full edit of a job (admin or owning recruiter via RLS). Supports optional logo replacement. */
export async function editJob(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const updates: Record<string, any> = {
    title: formData.get('title'),
    company_name: formData.get('company_name'),
    state: formData.get('state'),
    city: formData.get('city'),
    job_type: formData.get('job_type'),
    work_mode: formData.get('work_mode'),
    salary: formData.get('salary'),
    description: formData.get('description'),
    last_date: (formData.get('last_date') as string) || null,
    apply_link: (formData.get('apply_link') as string)?.trim() || null,
    apply_email: (formData.get('apply_email') as string)?.trim() || null,
  }
  const status = formData.get('status') as string
  if (status) updates.status = status

  // Optional new logo — never block the save if the upload fails.
  let warning: string | undefined
  const logo = formData.get('logo') as File | null
  if (logo && logo.size > 0) {
    try {
      updates.company_logo = await uploadFile(logo, 'job-logos')
    } catch (e: any) {
      warning = `Changes saved, but the new logo upload failed (${e.message}).`
    }
  }

  const { error } = await supabase.from('jobs').update(updates).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/jobs')
  revalidatePath('/admin')
  return { success: true, warning }
}

export async function getJobs(filters?: any) {
  const supabase = await createClient()
  let query = supabase.from('jobs').select('*').order('created_at', { ascending: false })

  if (filters?.query) {
    query = query.or(`title.ilike.%${filters.query}%,company_name.ilike.%${filters.query}%`)
  }
  if (filters?.location) {
    query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`)
  }
  if (filters?.job_type) {
    query = query.eq('job_type', filters.job_type)
  }
  if (filters?.work_mode) {
    query = query.eq('work_mode', filters.work_mode)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) return []
  return data
}

export async function getJobById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getRecentJobs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) return []
  return data
}

export async function deleteJob(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/jobs')
    revalidatePath('/admin')
    return { success: true }
}

export async function updateJob(id: string, updates: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('jobs').update(updates).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/jobs')
    revalidatePath('/admin')
    return { success: true }
}
