'use client'

import { type FormEvent, useState } from 'react'

import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { Profile } from '@/types/index'

type SettingsFormProps = {
  profile: Profile
}

type FormStatus =
  | {
      kind: 'error' | 'success'
      message: string
    }
  | null

const usernamePattern = /^[a-z0-9-]{3,30}$/

function getUsernameError(value: string) {
  if (usernamePattern.test(value)) {
    return null
  }

  return 'Username must be 3-30 characters using lowercase letters, numbers, and hyphens only'
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [username, setUsername] = useState(profile.username)
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [bio, setBio] = useState(profile.bio)
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [status, setStatus] = useState<FormStatus>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleUsernameBlur() {
    setUsernameError(getUsernameError(username.trim()))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedUsername = username.trim()
    const nextUsernameError = getUsernameError(trimmedUsername)

    if (nextUsernameError) {
      setUsernameError(nextUsernameError)
      return
    }

    setUsernameError(null)
    setStatus(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set('username', trimmedUsername)
    formData.set('display_name', displayName.trim())
    formData.set('bio', bio.trim())
    formData.set('website_url', websiteUrl.trim())

    try {
      const result = await updateProfile(formData)

      if (result.error) {
        setStatus({
          kind: 'error',
          message: result.error,
        })
        return
      }

      setUsername(result.data.username)
      setDisplayName(result.data.display_name)
      setBio(result.data.bio)
      setWebsiteUrl(result.data.website_url)
      setStatus({
        kind: 'success',
        message: 'Profile updated successfully.',
      })
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Unable to save your profile right now',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className='space-y-8' onSubmit={handleSubmit}>
      {profile.avatar_url ? (
        <>
          <div className='space-y-3'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt='Avatar'
              className='h-16 w-16 rounded-full object-cover'
              src={profile.avatar_url}
            />
            <p className='text-meta-base text-muted-foreground'>
              Avatar synced from OAuth provider
            </p>
          </div>
          <Separator />
        </>
      ) : null}

      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <Input
            autoComplete='off'
            className='h-11'
            id='username'
            name='username'
            onBlur={handleUsernameBlur}
            onChange={(event) => {
              const nextValue = event.target.value
              setUsername(nextValue)

              if (usernameError) {
                setUsernameError(getUsernameError(nextValue.trim()))
              }
            }}
            required
            spellCheck={false}
            value={username}
          />
          {usernameError ? (
            <p className='text-sm text-destructive'>{usernameError}</p>
          ) : null}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='display_name'>Display name</Label>
          <Input
            className='h-11'
            id='display_name'
            maxLength={60}
            name='display_name'
            onChange={(event) => setDisplayName(event.target.value)}
            value={displayName}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio'>Bio</Label>
          <Textarea
            id='bio'
            maxLength={280}
            name='bio'
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            value={bio}
          />
          <p aria-live='polite' className='text-right text-meta-base text-muted-foreground'>
            {bio.length}/280
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='website_url'>Website</Label>
          <Input
            className='h-11'
            id='website_url'
            inputMode='url'
            name='website_url'
            onChange={(event) => setWebsiteUrl(event.target.value)}
            type='url'
            value={websiteUrl}
          />
        </div>
      </div>

      {status ? (
        <div
          className={
            status.kind === 'error'
              ? 'rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive'
              : 'rounded-lg border border-border bg-background-secondary px-4 py-3 text-sm text-foreground'
          }
          role={status.kind === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </div>
      ) : null}

      <div className='flex justify-end'>
        <Button
          className='h-11 w-full px-5 sm:w-auto'
          disabled={isSubmitting}
          type='submit'
          variant='default'
        >
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
