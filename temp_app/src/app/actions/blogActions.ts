'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadFile } from '@/utils/bunny/storage'

export async function createBlog(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const content = formData.get('content') as string
  const author = (formData.get('author') as string) || 'Admin'
  const status = (formData.get('status') as string) || 'published'

  // Upload thumbnail to Bunny CDN (if provided). Don't block publishing on it —
  // if the upload fails, save the blog without a thumbnail.
  let thumbnail: string | undefined
  let warning: string | undefined
  const file = formData.get('thumbnail') as File | null
  if (file && file.size > 0) {
    try {
      thumbnail = await uploadFile(file, 'blog-thumbnails')
    } catch (e: any) {
      warning = `Blog saved, but the thumbnail upload failed (${e.message}).`
    }
  }

  const { data, error } = await supabase.from('blogs').insert([
    {
      title,
      category,
      content,
      author,
      thumbnail,
      status,
      created_by: user.id
    }
  ])

  if (error) return { error: error.message }
  revalidatePath('/tips')
  revalidatePath('/admin')
  return { success: true, warning }
}

export async function getBlogs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data
}

export async function getRecentBlogs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)
  
  if (error) return []
  return data
}

export async function deleteBlog(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/tips')
    revalidatePath('/admin')
    return { success: true }
}

export async function updateBlog(id: string, updates: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('blogs').update(updates).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/tips')
    revalidatePath('/admin')
    return { success: true }
}
