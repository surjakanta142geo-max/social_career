'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadFile } from '@/utils/bunny/storage'

export async function createJob(formData: FormData, logoUrl?: string) {
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
  const status = (formData.get('status') as string) || 'published'

  const { data, error } = await supabase.from('jobs').insert([
    {
      title,
      company_name,
      company_logo: logoUrl,
      state,
      city,
      job_type,
      work_mode,
      salary,
      description,
      last_date,
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
    query = query.ilike('title', `%${filters.query}%`)
  }
  if (filters?.job_type) {
    query = query.eq('job_type', filters.job_type)
  }
  if (filters?.work_mode) {
    query = query.eq('work_mode', filters.work_mode)
  }

  const { data, error } = await query
  if (error) return []
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
