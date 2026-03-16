'use client'

import { type RefObject, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.matches('[aria-disabled="true"]') &&
      !element.hasAttribute('hidden') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      (element.getClientRects().length > 0 || document.activeElement === element)
  )
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean
) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) {
      return
    }

    const container = containerRef.current

    if (!container) {
      return
    }

    const targetContainer: HTMLElement = container

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const hadTabIndex = targetContainer.hasAttribute('tabindex')

    if (!hadTabIndex) {
      targetContainer.setAttribute('tabindex', '-1')
    }

    const focusInitialElement = window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements(targetContainer)

      if (focusableElements.length === 0) {
        targetContainer.focus()
        return
      }

      if (!targetContainer.contains(document.activeElement)) {
        focusableElements[0]?.focus()
      }
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements(targetContainer)

      if (focusableElements.length === 0) {
        event.preventDefault()
        targetContainer.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null

      if (!targetContainer.contains(activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? lastElement : firstElement)?.focus()
        return
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
        return
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusInitialElement)
      document.removeEventListener('keydown', handleKeyDown)

      if (!hadTabIndex) {
        targetContainer.removeAttribute('tabindex')
      }

      const previousActiveElement = previousActiveElementRef.current

      if (previousActiveElement && document.contains(previousActiveElement)) {
        previousActiveElement.focus()
      }
    }
  }, [containerRef, isActive])
}
