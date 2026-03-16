'use client'

import { type ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/lib/utils'

type ModalWrapperProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
}

export function ModalWrapper({
  isOpen,
  onClose,
  children,
  title,
  className,
}: ModalWrapperProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useFocusTrap(dialogRef, isOpen)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-foreground/50 backdrop-blur-sm'
        onClick={onClose}
      />

      <div
        aria-labelledby={title ? titleId : undefined}
        aria-modal='true'
        className={cn(
          'relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain rounded-lg border border-border bg-background p-6 shadow-lg',
          className
        )}
        ref={dialogRef}
        role='dialog'
      >
        {title ? (
          <h2 className='mb-4 font-serif text-2xl text-foreground' id={titleId}>
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>,
    document.body
  )
}
