'use client'

import { useEffect, useState } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (mediaQuery.matches) {
      return
    }

    let frame = 0

    const updateProgress = () => {
      const { documentElement } = document
      const scrollTop = window.scrollY || documentElement.scrollTop
      const scrollHeight = documentElement.scrollHeight
      const clientHeight = documentElement.clientHeight
      const scrollableDistance = scrollHeight - clientHeight

      if (scrollableDistance <= 0) {
        setProgress(0)
        return
      }

      setProgress(Math.min(100, Math.max(0, (scrollTop / scrollableDistance) * 100)))
    }

    const scheduleProgressUpdate = () => {
      if (frame !== 0) {
        return
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateProgress()
      })
    }

    scheduleProgressUpdate()
    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true })

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener('scroll', scheduleProgressUpdate)
    }
  }, [])

  return progress
}
