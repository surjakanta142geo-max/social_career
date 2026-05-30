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
  const status = (formData.get('status') as string) || 'published'

  // If no contact email is provided, fall back to the creator's account email
  // so candidates can always reach the recruiter when there is no apply link.
  if (!apply_email) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()
    apply_email = profile?.email ?? user.email ?? null
  }

  // Upload company logo to Bunny CDN (if provided)
  let company_logo: string | undefined
  const logo = formData.get('logo') as File | null
  if (logo && logo.size > 0) {
    try {
      company_logo = await uploadFile(logo, 'job-logos')
    } catch (e: any) {
      return { error: `Logo upload failed: ${e.message}` }
    }
  }

  const { data, error } = await supabase.from('jobs').insert([
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
  return { success: true }
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
