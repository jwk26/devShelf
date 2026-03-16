import { redirect } from 'next/navigation'

import { SettingsForm } from '@/app/settings/settings-form'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/index'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnUrl=/settings')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    throw new Error(error?.message ?? 'Unable to load profile')
  }

  return (
    <main className='mx-auto max-w-2xl px-6 py-12'>
      <h1 className='mb-8 font-serif text-3xl text-foreground'>Settings</h1>
      <SettingsForm profile={profile as Profile} />
    </main>
  )
}
