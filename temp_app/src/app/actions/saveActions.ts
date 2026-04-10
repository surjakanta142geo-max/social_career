'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleSaveItem(itemId: string, type: 'job' | 'blog') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .eq('type', type)
    .single()

  if (existing) {
    // Unsave
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    // Save
    const { error } = await supabase
      .from('saved_items')
      .insert([
        {
          user_id: user.id,
          item_id: itemId,
          type,
        },
      ])
    if (error) return { error: error.message }
  }

  revalidatePath('/profile')
  revalidatePath('/jobs')
  revalidatePath('/tips')
  return { success: true, saved: !existing }
}

export async function getSavedItems(type: 'job' | 'blog') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)

    if (error) return []

    const itemIds = data.map(i => i.item_id)
    if (itemIds.length === 0) return []

    const tableName = type === 'job' ? 'jobs' : 'blogs'
    const { data: items } = await supabase
        .from(tableName)
        .select('*')
        .in('id', itemIds)

    return items || []
}
