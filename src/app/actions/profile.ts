'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { fail, ok, type ActionResult } from '@/app/actions/result'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/index'

const ProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9-]+$/,
      'Username must be lowercase letters, numbers, and hyphens only'
    ),
  display_name: z.string().max(60).optional().default(''),
  bio: z.string().max(280).optional().default(''),
  website_url: z.string().url().optional().or(z.literal('')).default(''),
})

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === 'string' ? value.trim() : ''
}

export async function updateProfile(
  formData: FormData
): Promise<ActionResult<Profile>> {
  const parsedProfile = ProfileSchema.safeParse({
    username: getFormValue(formData, 'username'),
    display_name: getFormValue(formData, 'display_name'),
    bio: getFormValue(formData, 'bio'),
    website_url: getFormValue(formData, 'website_url'),
  })

  if (!parsedProfile.success) {
    return fail(parsedProfile.error.issues[0]?.message ?? 'Invalid profile data')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return fail('Unauthorized')
  }

  const { username, display_name, bio, website_url } = parsedProfile.data

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user.id)
    .limit(1)
    .maybeSingle()

  if (existingProfileError) {
    return fail(existingProfileError.message)
  }

  if (existingProfile) {
    return fail('Username already taken')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username,
      display_name,
      bio,
      website_url,
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return fail(error.message)
  }

  revalidatePath('/settings')

  return ok(data as Profile)
}
