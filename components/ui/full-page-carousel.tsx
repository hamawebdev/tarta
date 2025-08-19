"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { useHydration } from '@/hooks/use-hydration'

interface Section {
  id: string
  type: 'hero' | 'product'
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
    dragThreshold: 15,
    inViewThreshold: 0.8,
    duration: 30,
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

  // Handle wheel events for desktop with improved debouncing
  useEffect(() => {
    if (!isHydrated || !emblaApi) return

    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const handleWheel = (event: WheelEvent) => {
      if (isScrolling) return

      // Prevent default scrolling
      event.preventDefault()

      // Clear existing timeout
      clearTimeout(scrollTimeout)

      // Add debouncing to prevent too rapid scrolling
      const threshold = 30
      if (Math.abs(event.deltaY) > threshold) {
        isScrolling = true

        if (event.deltaY > 0 && canScrollNext) {
          emblaApi.scrollNext()
        } else if (event.deltaY < 0 && canScrollPrev) {
          emblaApi.scrollPrev()
        }

        // Reset scrolling flag after animation completes
        scrollTimeout = setTimeout(() => {
          isScrolling = false
        }, 800) // Match with carousel animation duration
      }
    }

    // Add wheel event listener to the document
    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      document.removeEventListener('wheel', handleWheel)
      clearTimeout(scrollTimeout)
    }
  }, [emblaApi, canScrollNext, canScrollPrev, isHydrated])

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
