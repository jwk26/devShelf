'use client'

import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(() => ids[0] ?? '')
  const resolvedActiveId = ids.includes(activeId) ? activeId : (ids[0] ?? '')

  useEffect(() => {
    if (ids.length === 0) {
      return
    }

    const observedElements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement)

    if (observedElements.length === 0) {
      return
    }

    const visibleHeadingOffsets = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadingOffsets.set(entry.target.id, entry.boundingClientRect.top)
            return
          }

          visibleHeadingOffsets.delete(entry.target.id)
        })

        const [closestVisibleHeading] = [...visibleHeadingOffsets.entries()].sort(
          (leftEntry, rightEntry) => leftEntry[1] - rightEntry[1]
        )

        if (closestVisibleHeading) {
          setActiveId(closestVisibleHeading[0])
          return
        }

        const firstHeadingBelowViewport = observedElements.find(
          (element) => element.getBoundingClientRect().top >= 0
        )

        setActiveId(firstHeadingBelowViewport?.id ?? observedElements.at(-1)?.id ?? '')
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    observedElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [ids])

  return resolvedActiveId
}
