"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { useHydration } from '@/hooks/use-hydration'

interface Section {
  id: string
  type: 'hero' | 'product' | 'social'
  content: React.ReactNode
}

interface FullPageCarouselProps {
  sections: Section[]
  className?: string
  setApi?: (api: UseEmblaCarouselType[1]) => void
}

export function FullPageCarousel({ sections, className = '', setApi }: FullPageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    loop: false,
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    watchDrag: true,
    watchResize: true,
    watchSlides: true,
    dragThreshold: 8, // slightly more responsive on touch devices
    inViewThreshold: 0.9, // require slides to be more in view before snapping (smoother)
    duration: 18, // Faster transitions to reduce perceived latency
    startIndex: 0,
    // Enhanced smooth scrolling
    align: 'start',
    slidesToScroll: 1,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const isHydrated = useHydration()

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    // Initialize the state immediately
    onSelect(emblaApi)

    // Enable easing for smoother momentum feel
    // Note: Embla uses easing internally; we ensure our CSS respects it via transition classes

    // Pass API to parent component
    if (setApi) {
      setApi(emblaApi)
    }

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect, setApi])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isHydrated || !emblaApi) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        emblaApi.scrollPrev()
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        emblaApi.scrollNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [emblaApi, isHydrated])

  // Handle wheel events for desktop with lower latency and delta-proportional steps
  useEffect(() => {
    if (!isHydrated || !emblaApi) return

    let isAnimating = false
    let wheelAccumulator = 0
    let lastWheelTime = 0
    let unlockTimer: number | null = null

    const STEP_SIZE = 120 // Typical wheel notch in px-equivalent units
    const ACTIVATION = 30 // Lower threshold for more responsive start
    const MAX_STEPS = 3 // Cap how many slides to advance per strong flick
    const RESET_MS = 300 // Reset accumulation if wheel pauses

    const releaseOnSettle = () => {
      isAnimating = false
    }

    const handleWheel = (event: WheelEvent) => {
      // Prevent native scroll to keep snapping behavior
      event.preventDefault()
      event.stopPropagation()

      const now = performance.now()
      if (now - lastWheelTime > RESET_MS) {
        wheelAccumulator = 0
      }
      lastWheelTime = now

      // Normalize delta for line-based wheels
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
      wheelAccumulator += delta

      if (Math.abs(wheelAccumulator) < ACTIVATION) return
      if (isAnimating) return

      const direction = wheelAccumulator > 0 ? 1 : -1
      const steps = Math.min(
        MAX_STEPS,
        Math.max(1, Math.floor(Math.abs(wheelAccumulator) / STEP_SIZE) || 1)
      )

      const snaps = emblaApi.scrollSnapList()
      const current = emblaApi.selectedScrollSnap()
      const target = Math.max(0, Math.min(snaps.length - 1, current + direction * steps))

      emblaApi.scrollTo(target)

      // Reduce accumulator by the amount we just consumed so large flicks can continue
      wheelAccumulator -= direction * steps * STEP_SIZE

      // Gate further wheel-triggered scrolls briefly to reduce jitter but keep it snappy
      isAnimating = true
      if (unlockTimer) window.clearTimeout(unlockTimer)
      unlockTimer = window.setTimeout(() => {
        isAnimating = false
      }, 220)
    }

    // Also unlock when Embla settles naturally
    emblaApi.on('settle', releaseOnSettle)

    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      document.removeEventListener('wheel', handleWheel)
      emblaApi.off('settle', releaseOnSettle)
      if (unlockTimer) window.clearTimeout(unlockTimer)
    }
  }, [emblaApi, isHydrated])

  return (
    <div className={`relative h-screen w-full overflow-hidden ${className}`}>
      <div
        className="embla h-full overflow-hidden"
        ref={emblaRef}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="embla__container h-full flex flex-col"
          style={{
            touchAction: 'pan-y',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        >
          {sections.map((section) => (
            <div
              key={section.id}
              className="embla__slide h-screen w-full flex-shrink-0 relative"
              style={{
                touchAction: 'pan-y',
                minHeight: 0,
                flex: '0 0 100%',
                willChange: 'transform',
                transform: 'translateZ(0)' // Force hardware acceleration
              }}
            >
              {section.content}
            </div>
          ))}
        </div>
      </div>

      {/* Instagram-style Progress Indicators */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1.5 z-50">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-1 rounded-full transition-all duration-500 ease-out ${
              index === selectedIndex
                ? 'bg-white shadow-lg shadow-white/30 h-12'
                : 'bg-white/30 hover:bg-white/50 h-6'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>



      {/* Scroll Progress Bar (top) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div
          className="h-full bg-white/60 transition-all duration-300 ease-out"
          style={{
            width: `${((selectedIndex + 1) / sections.length) * 100}%`
          }}
        />
      </div>

      {/* Desktop Navigation Arrows (hidden on mobile) */}
      <div className="hidden md:block">
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300"
            aria-label="Previous section"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="absolute left-6 bottom-20 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300"
            aria-label="Next section"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
