'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadFile } from '@/utils/bunny/storage'

export async function updateProfile(formData: FormData, avatarUrl?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    const { error } = await supabase.from('profiles').update({
        name,
        phone,
        avatar: avatarUrl
    }).eq('id', user.id)

    if (error) return { error: error.message }
    revalidatePath('/profile')
    return { success: true }
}

export async function getRecentJoiners() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('name, email, role, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
    
    if (error) return []
    return data
}

export async function getUserProfile(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    
    if (error) return null
    return data
}
