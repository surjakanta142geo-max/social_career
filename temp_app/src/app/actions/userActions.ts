'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadFile } from '@/utils/bunny/storage'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    const updates: Record<string, any> = { name, phone }

    // Company / organisation fields are only present on the recruiter form.
    // Use has() so the job-seeker form never nulls them out.
    if (formData.has('company_name')) {
        updates.company_name = (formData.get('company_name') as string) || null
    }
    if (formData.has('org_name')) {
        updates.org_name = (formData.get('org_name') as string) || null
    }

    // Only upload/overwrite the avatar when a new file is provided. Don't block
    // saving the rest of the profile if the avatar upload fails.
    let warning: string | undefined
    const avatar = formData.get('avatar') as File | null
    if (avatar && avatar.size > 0) {
        try {
            updates.avatar = await uploadFile(avatar, 'avatars')
        } catch (e: any) {
            warning = `Profile saved, but the avatar upload failed (${e.message}).`
        }
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

    if (error) return { error: error.message }
    revalidatePath('/profile')
    return { success: true, warning }
}

export async function getAllUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}

/** Admin-only: change a user's role (job_seeker | recruiter | admin). */
export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (me?.role !== 'admin') return { error: 'Only admins can change roles' }

    if (!['admin', 'recruiter', 'job_seeker'].includes(role)) {
        return { error: 'Invalid role' }
    }
    // Guard: don't let an admin demote themselves (avoids locking out the panel).
    if (userId === user.id && role !== 'admin') {
        return { error: 'You cannot change your own admin role' }
    }

    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) return { error: error.message }
    revalidatePath('/admin')
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
